import { useMemo, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M2 12s3.5-6 10-6c2.3 0 4.2 0.8 5.8 1.8" />
      <path d="M22 12s-3.5 6-10 6c-2.3 0-4.2-0.8-5.8-1.8" />
      <path d="M4 4l16 16" />
    </svg>
  );
}

function App() {
  const [password, setPassword] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [requestError, setRequestError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const canSubmit = useMemo(() => password.trim().length > 0, [password]);

  const strengthLabel = result?.strength ? result.strength.toUpperCase() : '-';
  const strengthClass = result?.strength ? `strength-${result.strength}` : '';

  async function handleValidate(event) {
    event.preventDefault();

    if (!canSubmit) {
      setRequestError('Digite uma senha antes de validar.');
      setResult(null);
      return;
    }

    setLoading(true);
    setRequestError('');

    try {
      const response = await fetch(`${API_URL}/validate-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password })
      });

      if (!response.ok) {
        throw new Error('Falha ao validar senha.');
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setRequestError(error.message || 'Erro de comunicação com a API.');
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page">
      <section className="card">
        <header className="title-group">
          <p className="eyebrow">Security Check</p>
          <h1>Validador de Senha</h1>
          <p className="subtitle">Receba uma análise imediata de força e conformidade.</p>
        </header>

        <form className="form" onSubmit={handleValidate}>
          <label htmlFor="password">Senha</label>

          <div className="password-wrapper">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Digite a senha"
              autoComplete="off"
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword((currentValue) => !currentValue)}
              aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              aria-pressed={showPassword}
              title={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>

          <button type="submit" disabled={loading || !canSubmit}>
            {loading ? 'Validando...' : 'Validar senha'}
          </button>
        </form>

        {requestError && <p className="error">{requestError}</p>}

        {result && (
          <section className="result" aria-live="polite">
            <div className="result-header">
              <span className={`badge ${result.valid ? 'badge-ok' : 'badge-fail'}`}>
                {result.valid ? 'Senha válida' : 'Senha inválida'}
              </span>
              <span className={`strength ${strengthClass}`}>Força: {strengthLabel}</span>
            </div>

            <div className="result-block">
              <h2>Erros</h2>
              <ul>
                {result.errors.length === 0 ? <li>Nenhum</li> : null}
                {result.errors.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="result-block">
              <h2>Sugestões</h2>
              <ul>
                {result.suggestions.length === 0 ? <li>Nenhuma</li> : null}
                {result.suggestions.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </section>
        )}
      </section>
    </main>
  );
}

export default App;
