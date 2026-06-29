import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, UserPlus, TrendingUp, BarChart3, Target, Zap } from 'lucide-react';

const FEATURES = [
  {
    icon: <BarChart3 className="w-5 h-5 text-emerald-400" />,
    title: 'Momios en tiempo real',
    desc: 'Compara líneas clave sin brincar entre casas.',
  },
  {
    icon: <Target className="w-5 h-5 text-blue-400" />,
    title: 'Ligas principales',
    desc: 'MLB, NBA, NFL, NHL y fútbol en una sola vista.',
  },
  {
    icon: <TrendingUp className="w-5 h-5 text-amber-300" />,
    title: 'Análisis accionable',
    desc: 'Tendencias, H2H, lesiones y contexto del matchup.',
  },
  {
    icon: <Zap className="w-5 h-5 text-lime-300" />,
    title: '5 días gratis',
    desc: 'Explora la plataforma antes de comprometerte.',
  },
];

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, password, name);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-shell">
      <section className="login-brand-panel">
        <p className="eyebrow">Outlier MX</p>
        <h1 className="page-title" style={{ maxWidth: 620 }}>
          Decide mejor antes de apostar.
        </h1>
        <p className="page-copy" style={{ fontSize: 16, maxWidth: 560 }}>
          Un dashboard diseñado para comparar partidos, detectar señales y guardar picks sin perder el hilo.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 12, marginTop: 34, maxWidth: 640 }}>
          {FEATURES.map(feature => (
            <Feature key={feature.title} {...feature} />
          ))}
        </div>
      </section>

      <section className="login-card-panel">
        <div className="login-card">
          <div style={{ marginBottom: 26 }}>
            <p className="eyebrow">Outlier MX</p>
            <h2 style={{ margin: 0, color: '#f2f7f3', fontSize: 28, fontWeight: 800, lineHeight: 1 }}>
              {isLogin ? 'Bienvenido de vuelta' : 'Crea tu cuenta'}
            </h2>
            <p style={{ margin: '10px 0 0', color: 'var(--muted)', fontSize: 14, lineHeight: 1.5 }}>
              {isLogin
                ? 'Accede a tus partidos, picks y oportunidades guardadas.'
                : 'Empieza con 5 días gratis, sin tarjeta de crédito.'}
            </p>
          </div>

          {error && (
            <div style={{
              background: 'rgba(248,113,113,0.10)',
              border: '1px solid rgba(248,113,113,0.28)',
              color: '#fca5a5',
              padding: '11px 13px',
              borderRadius: 8,
              marginBottom: 16,
              fontSize: 13,
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {!isLogin && (
              <label>
                <span style={{ display: 'block', color: 'var(--muted)', fontSize: 13, marginBottom: 6 }}>Nombre</span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="login-input"
                  placeholder="Tu nombre"
                />
              </label>
            )}

            <label>
              <span style={{ display: 'block', color: 'var(--muted)', fontSize: 13, marginBottom: 6 }}>Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="login-input"
                placeholder="tu@email.com"
              />
            </label>

            <label>
              <span style={{ display: 'block', color: 'var(--muted)', fontSize: 13, marginBottom: 6 }}>Contraseña</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="login-input"
                placeholder="Mínimo 6 caracteres"
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="primary-action"
              style={{ marginTop: 4, minHeight: 46, opacity: loading ? 0.72 : 1 }}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
              ) : isLogin ? (
                <>
                  <LogIn className="w-5 h-5" /> Entrar
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" /> Crear cuenta gratis
                </>
              )}
            </button>
          </form>

          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            style={{
              width: '100%',
              marginTop: 18,
              background: 'transparent',
              border: 0,
              color: '#6bfb9a',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            {isLogin ? '¿No tienes cuenta? Regístrate gratis' : '¿Ya tienes cuenta? Inicia sesión'}
          </button>
        </div>
      </section>
    </div>
  );
}

function Feature({ icon, title, desc }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: 12,
      padding: 14,
      borderRadius: 8,
      border: '1px solid var(--line)',
      background: 'rgba(255,255,255,0.035)',
    }}>
      <div style={{
        width: 34,
        height: 34,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        background: 'rgba(255,255,255,0.05)',
        flexShrink: 0,
      }}>
        {icon}
      </div>
      <div>
        <h3 style={{ margin: 0, color: 'var(--text)', fontSize: 14, fontWeight: 700 }}>{title}</h3>
        <p style={{ margin: '4px 0 0', color: 'var(--muted)', fontSize: 12.5, lineHeight: 1.45 }}>{desc}</p>
      </div>
    </div>
  );
}
