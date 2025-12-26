import type { VineValidator } from '@vinejs/vine';
import type { Infer, SchemaTypes } from '@vinejs/vine/types';

export type FieldValidationMode = 'onsubmit' | 'onblur' | 'onchange';

export type FormState<T> = {
	values: T;
	errors: Record<string, string[]>;
	touched: Record<string, boolean>;
	isSubmitting: boolean;
	isValid: boolean;
};

export type FieldState = {
	/** Current input value */
	input: string;
	/** Array of error messages for this field, or undefined if no errors */
	errors: string[] | undefined;
	/** Whether the field has been touched (blurred) */
	touched: boolean;
	/** Accessibility and form props to spread onto the input */
	props: {
		id: string;
		name: string;
		'aria-invalid': boolean;
		'aria-describedby': string | undefined;
		onblur: () => void;
		oninput: (e: Event) => void;
	};
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyValidator = VineValidator<SchemaTypes, Record<string, any> | undefined>;
export type InferOutput<V extends AnyValidator> = Infer<V>;

/** Backend error format from AdonisJS/Tuyau validation */
export type BackendValidationError = {
	errors: Array<{ field: string; message: string; rule?: string }>;
};

/** Backend error format from AdonisJS exceptions */
export type BackendExceptionError = {
	message: string;
	code?: string;
};

export type BackendError = BackendValidationError | BackendExceptionError | string | unknown;

export type FormContext<V extends AnyValidator> = {
	_validator: V;
	_state: FormState<InferOutput<V>>;
	_fieldModes: Record<string, FieldValidationMode>;
	_formId: string;

	/** Whether the form is currently being submitted */
	isSubmitting: boolean;
	/** Whether the form has no validation errors */
	isValid: boolean;
	/** Whether any field has been touched */
	isDirty: boolean;
	/** Global form error (non-field-specific) */
	formError: string | undefined;

	getValue: <K extends keyof InferOutput<V>>(field: K) => string;
	setValue: <K extends keyof InferOutput<V>>(field: K, value: string) => void;
	getErrors: <K extends keyof InferOutput<V>>(field: K) => string[] | undefined;
	setFieldMode: <K extends keyof InferOutput<V>>(field: K, mode: FieldValidationMode) => void;
	getFieldMode: <K extends keyof InferOutput<V>>(field: K) => FieldValidationMode;
	touch: <K extends keyof InferOutput<V>>(field: K) => void;
	isTouched: <K extends keyof InferOutput<V>>(field: K) => boolean;
	validate: () => Promise<{ success: true; data: InferOutput<V> } | { success: false }>;
	validateField: <K extends keyof InferOutput<V>>(field: K) => Promise<void>;
	setSubmitting: (value: boolean) => void;
	setErrors: (error: BackendError) => void;
	clearErrors: () => void;
	reset: () => void;
};

type CreateFormOptions = {
	defaultValidationMode?: FieldValidationMode;
};

let formIdCounter = 0;

export function createForm<V extends AnyValidator>(
	validator: V,
	options: CreateFormOptions = {}
): FormContext<V> {
	const { defaultValidationMode = 'onsubmit' } = options;

	const formId = `form-${++formIdCounter}`;

	let state = $state<FormState<InferOutput<V>>>({
		values: {} as InferOutput<V>,
		errors: {},
		touched: {},
		isSubmitting: false,
		isValid: true
	});

	let fieldModes = $state<Record<string, FieldValidationMode>>({});

	function getValue<K extends keyof InferOutput<V>>(field: K): string {
		return (state.values[field] as string) ?? '';
	}

	function setValue<K extends keyof InferOutput<V>>(field: K, value: string): void {
		(state.values as Record<string, unknown>)[field as string] = value;
	}

	function getErrors<K extends keyof InferOutput<V>>(field: K): string[] | undefined {
		const errors = state.errors[field as string];
		return errors && errors.length > 0 ? errors : undefined;
	}

	function setFieldMode<K extends keyof InferOutput<V>>(field: K, mode: FieldValidationMode): void {
		fieldModes[field as string] = mode;
	}

	function getFieldMode<K extends keyof InferOutput<V>>(field: K): FieldValidationMode {
		return fieldModes[field as string] ?? defaultValidationMode;
	}

	function touch<K extends keyof InferOutput<V>>(field: K): void {
		state.touched[field as string] = true;
	}

	function isTouched<K extends keyof InferOutput<V>>(field: K): boolean {
		return state.touched[field as string] ?? false;
	}

	async function validateField<K extends keyof InferOutput<V>>(field: K): Promise<void> {
		try {
			await validator.validate(state.values);
			// Clear errors for this field if validation passes
			delete state.errors[field as string];
		} catch (error: unknown) {
			if (error && typeof error === 'object' && 'messages' in error) {
				const messages = (error as { messages: Array<{ field: string; message: string }> })
					.messages;
				// Update only this field's errors
				const fieldErrors = messages.filter((m) => m.field === field).map((m) => m.message);
				if (fieldErrors.length > 0) {
					state.errors[field as string] = fieldErrors;
				} else {
					delete state.errors[field as string];
				}
			}
		}
		state.isValid = Object.keys(state.errors).length === 0;
	}

	async function validate(): Promise<{ success: true; data: InferOutput<V> } | { success: false }> {
		state.isSubmitting = true;
		state.errors = {};

		try {
			const data = await validator.validate(state.values);
			state.isValid = true;
			state.isSubmitting = false;
			return { success: true, data };
		} catch (error: unknown) {
			if (error && typeof error === 'object' && 'messages' in error) {
				const messages = (error as { messages: Array<{ field: string; message: string }> })
					.messages;
				const errorsByField: Record<string, string[]> = {};
				for (const msg of messages) {
					if (!errorsByField[msg.field]) {
						errorsByField[msg.field] = [];
					}
					errorsByField[msg.field].push(msg.message);
				}
				state.errors = errorsByField;
			}
			state.isValid = false;
			state.isSubmitting = false;
			return { success: false };
		}
	}

	function reset(): void {
		state.values = {} as InferOutput<V>;
		state.errors = {};
		state.touched = {};
		state.isSubmitting = false;
		state.isValid = true;
		formError = undefined;
	}

	function setSubmitting(value: boolean): void {
		state.isSubmitting = value;
	}

	let formError = $state<string | undefined>(undefined);

	function setErrors(error: BackendError): void {
		state.errors = {};
		formError = undefined;

		if (typeof error === 'string') {
			formError = error;
			state.isValid = false;
			return;
		}

		if (error && typeof error === 'object') {
			if ('errors' in error && Array.isArray(error.errors)) {
				const errorsByField: Record<string, string[]> = {};
				for (const msg of error.errors as Array<{ field: string; message: string }>) {
					if (!errorsByField[msg.field]) {
						errorsByField[msg.field] = [];
					}
					errorsByField[msg.field].push(msg.message);
				}
				state.errors = errorsByField;
				state.isValid = Object.keys(errorsByField).length === 0;
				return;
			}

			if ('message' in error && typeof error.message === 'string') {
				formError = error.message;
				state.isValid = false;
				return;
			}
		}

		formError = 'An unexpected error occurred';
		state.isValid = false;
	}

	function clearErrors(): void {
		state.errors = {};
		formError = undefined;
		state.isValid = true;
	}

	return {
		_validator: validator,
		get _state() {
			return state;
		},
		get _fieldModes() {
			return fieldModes;
		},
		_formId: formId,
		get isSubmitting() {
			return state.isSubmitting;
		},
		get isValid() {
			return state.isValid;
		},
		get isDirty() {
			return Object.keys(state.touched).length > 0;
		},
		get formError() {
			return formError;
		},
		getValue,
		setValue,
		getErrors,
		setFieldMode,
		getFieldMode,
		touch,
		isTouched,
		validate,
		validateField,
		setSubmitting,
		setErrors,
		clearErrors,
		reset
	};
}
