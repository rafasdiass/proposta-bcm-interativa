# IntentForm Component

## Overview

The `IntentForm` component is a comprehensive form for capturing user intent to proceed with the BCM proposal. It includes client-side validation, LGPD compliance, error handling, and full accessibility support.

## Features

- **Required Fields**: Full name, corporate email, role in decision-making, and LGPD consent
- **Optional Fields**: Phone number and message
- **Real-time Validation**: Validates fields on blur with immediate visual feedback
- **LGPD Compliance**: Explicit consent checkbox with clear privacy notice
- **Error Handling**: Network error handling with retry mechanism and mailto fallback
- **Success State**: Confirmation message with auto-close after 3 seconds
- **Accessibility**: Full keyboard navigation, ARIA labels, and screen reader support
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## Usage

### Basic Usage

```tsx
import { IntentForm } from './components/interactive/IntentForm';

function App() {
  return <IntentForm />;
}
```

### With Endpoint and Callback

```tsx
import { IntentForm } from './components/interactive/IntentForm';

function App() {
  const handleClose = () => {
    console.log('Form closed');
  };

  return (
    <IntentForm
      endpoint="https://api.example.com/intent"
      onClose={handleClose}
    />
  );
}
```

### In a Modal

```tsx
import { IntentForm } from './components/interactive/IntentForm';

function App() {
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      <button onClick={() => setShowForm(true)}>
        Sign Intent
      </button>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="max-w-2xl w-full">
            <IntentForm onClose={() => setShowForm(false)} />
          </div>
        </div>
      )}
    </>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onClose` | `() => void` | `undefined` | Optional callback function called when the form is closed (via cancel button or after successful submission) |
| `endpoint` | `string` | `import.meta.env.VITE_INTENT_ENDPOINT \|\| ''` | API endpoint for form submission. Falls back to environment variable if not provided |

## Form Fields

### Required Fields

1. **Full Name** (`fullName`)
   - Type: Text input
   - Validation: Required, minimum 3 characters
   - Error messages:
     - "Nome completo é obrigatório" (when empty)
     - "Nome deve ter pelo menos 3 caracteres" (when too short)

2. **Corporate Email** (`email`)
   - Type: Email input
   - Validation: Required, valid email format
   - Error messages:
     - "Email é obrigatório" (when empty)
     - "Email inválido" (when format is invalid)

3. **Role in Decision** (`role`)
   - Type: Select dropdown
   - Options:
     - Decisor Final (Final Decision Maker)
     - Influenciador (Influencer)
     - Avaliador Técnico (Technical Evaluator)
     - Avaliador Financeiro (Financial Evaluator)
     - Outro (Other)
   - Validation: Required
   - Error message: "Papel na decisão é obrigatório"

4. **LGPD Consent** (`consentGiven`)
   - Type: Checkbox
   - Validation: Required (must be checked)
   - Error message: "Você deve concordar para continuar"

### Optional Fields

1. **Phone** (`phone`)
   - Type: Tel input
   - Validation: None (optional)
   - Placeholder: "(00) 00000-0000"

2. **Message** (`message`)
   - Type: Textarea
   - Validation: None (optional)
   - Placeholder: "Comentários, dúvidas ou observações adicionais..."

## Form States

### Idle State
- Initial state when form is first rendered
- All fields are empty
- Submit button is disabled until all required fields are valid

### Submitting State
- Triggered when user clicks submit button
- Submit button shows loading spinner and "Enviando..." text
- Submit button is disabled during submission
- Form fields remain enabled

### Success State
- Shown after successful form submission
- Displays success message with checkmark icon
- Shows "Intenção Registrada com Sucesso!" heading
- Includes thank you message
- Auto-closes after 3 seconds if `onClose` callback is provided
- Provides manual close button

### Error State
- Shown when form submission fails
- Displays error message in red alert box
- Provides two options:
  1. "Tentar novamente" button to retry submission
  2. "Enviar por email" link as fallback (opens mailto link)
- Form remains editable for corrections

## Validation Behavior

- **Validation Mode**: `onTouched` - validates when field loses focus
- **Real-time Feedback**: Error messages appear immediately after validation
- **Visual Indicators**:
  - Red border on invalid fields
  - Error icon next to error messages
  - ARIA attributes for screen readers
- **Submit Button**: Disabled until all required fields are valid

## Error Handling

### Network Errors
- Catches fetch errors and displays user-friendly message
- Provides retry button to attempt submission again
- Offers mailto fallback link to `rafaeldias@lavitacode.com.br`

### Missing Endpoint
- If no endpoint is configured, shows specific error message
- "Endpoint de submissão não configurado"
- Still provides mailto fallback option

### Validation Errors
- Prevents submission if required fields are invalid
- Shows specific error messages for each field
- Highlights invalid fields with red border

## Accessibility

### Keyboard Navigation
- All form fields are keyboard accessible
- Tab order follows logical flow
- Enter/Space activates buttons and checkboxes
- Escape key can be used to close modal (if implemented by parent)

### Screen Reader Support
- All inputs have associated labels
- Error messages are announced via `role="alert"`
- Invalid fields marked with `aria-invalid="true"`
- Error messages linked via `aria-describedby`
- Submit button has descriptive `aria-label`

### Visual Accessibility
- WCAG AA contrast ratios maintained
- Focus indicators visible on all interactive elements
- Error states clearly distinguished with color and icons
- Required fields marked with asterisk (*)

## LGPD Compliance

The form includes comprehensive LGPD (Lei Geral de Proteção de Dados) compliance:

1. **Explicit Consent**: Required checkbox that must be actively checked
2. **Clear Purpose**: States data will be used for commercial contact related to the proposal
3. **Confidentiality Notice**: Explains data will be treated confidentially per LGPD
4. **Authorization Confirmation**: Footer notice confirms user is authorized to represent their organization

## API Integration

### Request Format

```typescript
POST {endpoint}
Content-Type: application/json

{
  "fullName": "João Silva",
  "email": "joao@empresa.com.br",
  "phone": "(11) 98765-4321",  // optional
  "role": "decisor-final",
  "message": "Gostaria de mais informações",  // optional
  "consentGiven": true
}
```

### Expected Response

```typescript
{
  "success": boolean,
  "message": string,
  "id"?: string  // optional
}
```

### Response Handling
- **Success (200-299)**: Shows success message and auto-closes
- **Error (400-599)**: Shows error message with retry option
- **Network Error**: Shows error message with retry and mailto fallback

## Environment Configuration

Configure the submission endpoint via environment variable:

```bash
# .env file
VITE_INTENT_ENDPOINT=https://api.example.com/intent
```

## Styling

The component uses Tailwind CSS with the project's custom theme:

- **Primary Color**: Blue (#1B3A6B) for primary actions
- **Error Color**: Red for validation errors
- **Success Color**: Green for success state
- **Background**: White with subtle shadows
- **Typography**: Inter font family

## Testing

The component includes comprehensive unit tests covering:

- Rendering of all form fields
- Validation behavior for each field
- Form submission success and error scenarios
- Accessibility features (ARIA attributes, keyboard navigation)
- LGPD compliance elements
- Cancel functionality

Run tests with:

```bash
npm run test -- IntentForm.test.tsx
```

## Best Practices

1. **Always provide an endpoint**: Configure `VITE_INTENT_ENDPOINT` in production
2. **Use in a modal**: Wrap in a modal for better UX
3. **Handle onClose**: Implement proper modal close behavior
4. **Test submission**: Verify endpoint is working before deployment
5. **Monitor errors**: Log submission errors for debugging

## Related Components

- **Sticky CTA**: Uses IntentForm in a modal for "Assinar Intenção" action
- **Next Steps Section**: May include IntentForm as primary CTA

## Requirements Satisfied

This component satisfies the following requirements from the specification:

- **Requirement 13.1**: Collects required and optional fields
- **Requirement 13.2**: Submits to configurable endpoint with confirmation
- **Requirement 13.3**: Client-side validation with field-specific messages
- **Requirement 13.4**: Network error handling with retry and mailto fallback
- **Requirement 13.5**: LGPD compliance with explicit consent
