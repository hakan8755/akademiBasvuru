import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { createContext, useState, useContext } from 'react';

// Sayfalar
import RoleSelection from './pages/RoleSelection';
import AdayLogin from './pages/AdayLogin';
import AdayRegister from './pages/AdayRegister';
import IlanPage from './pages/IlanPage';
import Makaleler from './pages/makaleler';
import BilimselToplantiFaaliyetleri from './pages/BilimselToplantiFaaliyetleri';
import Kitaplar from './pages/kitap';
import Faaliyetler from './pages/atıflar';
import DersVerme from './pages/DersVerme';
import TezYonetimi from './pages/TezYönetimi';
import Patentler from './pages/Patent';
import ArastirmaProjeleri from './pages/AraştırmaProjeleri';
import DergiEditorluk from './pages/DergiEditorluk';
import Basarılar from './pages/Basarılar';
import Gorevler from './pages/Gorevler';
import Sanat from './pages/Sanat'
import AdminLogin from './pages/AdminLogin';
import AdminPanel from './pages/AdminPanel';
import IlanForm from './pages/IlanForm';
import BasvuruKontrolFormu from './pages/BasvuruKontrolFormu';
import PuanTablosu from './pages/PuanTablosu';
import JuriLogin from './pages/JuriLogin';
import JuriPanel from './pages/JuriPanel';


// Auth context
const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

// Auth sağlayıcısı
function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (u) => setUser(u);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Giriş gerektiren sayfalar için koruma
function PrivateRoute({ children, allowRoles }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/aday/login" state={{ from: location }} replace />;
  }

  if (allowRoles && !allowRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

// Uygulama rotaları
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Herkese açık rotalar */}
          <Route path="/" element={<RoleSelection />} />
          <Route path="/aday/login" element={<AdayLogin />} />
          <Route path="/aday/register" element={<AdayRegister />} />

          {/* Aday'a özel korumalı rotalar */}
          <Route
            path="/makaleler"
            element={
              <PrivateRoute allowRoles={['aday', 'admin']}>
                <Makaleler />
              </PrivateRoute>
            }
          />
          <Route
            path="/ilanlar"
            element={
              <PrivateRoute allowRoles={['aday', 'admin']}>
                <IlanPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/BilimselToplantiFaaliyetleri"
            element={
              <PrivateRoute allowRoles={['aday']}>
                <BilimselToplantiFaaliyetleri />
              </PrivateRoute>
            }
          />
          <Route
            path="/kitaplar"
            element={
              <PrivateRoute allowRoles={['aday']}>
                <Kitaplar />
              </PrivateRoute>
            }
          />
          <Route
            path="/atıflar"
            element={
              <PrivateRoute allowRoles={['aday']}>
                <Faaliyetler />
              </PrivateRoute>
            }
          />
          <Route
            path="/dersverme"
            element={
              <PrivateRoute allowRoles={['aday']}>
                <DersVerme />
              </PrivateRoute>
            }
          />
          <Route
            path="/tezyonetimi"
            element={
              <PrivateRoute allowRoles={['aday']}>
                <TezYonetimi />
              </PrivateRoute>
            }
          />
          <Route
            path="/patentler"
            element={
              <PrivateRoute allowRoles={['aday']}>
                <Patentler />
              </PrivateRoute>
            }
          />
          <Route
            path="/AraştırmaProjeleri"
            element={
              <PrivateRoute allowRoles={['aday']}>S
                <ArastirmaProjeleri />
              </PrivateRoute>
            }
          />
          <Route
            path="/DergiEditörlük"
            element={
              <PrivateRoute allowRoles={['aday']}>S
                <DergiEditorluk />
              </PrivateRoute>
            }
          />
          <Route
            path="/basarılar"
            element={
              <PrivateRoute allowRoles={['aday']}>S
                <Basarılar />
              </PrivateRoute>
            }
          />
          <Route
            path="/Gorevler"
            element={
              <PrivateRoute allowRoles={['aday']}>S
                <Gorevler />
              </PrivateRoute>
            }
          />
          <Route
            path="/Sanat"
            element={
              <PrivateRoute allowRoles={['aday']}>S
                <Sanat />
              </PrivateRoute>
            }
          />
          <Route path="/puan-tablosu" element={<PuanTablosu />} />
          <Route path="/admin/login" element={<AdminLogin />} />


          {/* Bilinmeyen yol olursa */}
          <Route path="*" element={<Navigate to="/" replace />} />

          <Route
            path="/admin/panel"
            element={
              <PrivateRoute allowRoles={['admin']}>
                <AdminPanel />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <PrivateRoute allowRoles={['admin']}>
                <AdminPanel />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/ilan-yeni"
            element={
              <PrivateRoute allowRoles={['admin']}>
                <IlanForm />
              </PrivateRoute>
            }
          />
          <Route path="/basvuru-kontrol" element={<BasvuruKontrolFormu />} />

          <Route path="/juri/login" element={<JuriLogin />} />
          <Route path="/juri/panel" element={
            <PrivateRoute allowRoles={['juri','admin']}>
              <JuriPanel />
            </PrivateRoute>
          } />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}