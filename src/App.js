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
import YoneticiLogin from './pages/YoneticiLogin';
import YoneticiPanel from './pages/YoneticiPanel';
import JuriAtama from './pages/JuriAtama';
import AdminUsers from './pages/adminuser';
import YoneticiBasvurular from './pages/YoneticiBasvurular';
import YoneticiBasvuruDetay from './pages/YoneticiBasvuruDetay';
import YoneticiPdfIndir from './pages/YoneticiPdfIndir';










// Auth context
const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

// Auth sağlayıcısı
function AuthProvider({ children }) {
  const [user, setUser] = useState(null);


  //********* */
  const login = (u) => {
    setUser(u);
    localStorage.setItem('userId', u._id);   // ⬅️
  };
  const logout = () => {
    setUser(null);
    localStorage.removeItem('userId');
    localStorage.removeItem('applicationId');
    localStorage.removeItem('ilanId');
  };

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

  // Eğer aday sayfasıysa ve ilanId yoksa geri gönder
  const isAdayForm = location.pathname !== '/ilanlar' && user.role === 'aday';
  if (isAdayForm && !localStorage.getItem('ilanId')) {
    return <Navigate to="/ilanlar" replace />;
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
          <Route path="/yonetici/login" element={<YoneticiLogin />} />

          {/* Aday'a özel korumalı rotalar */}
          <Route
            path="/yonetici/panel"
            element={
              <PrivateRoute allowRoles={['yonetici']}>
                <YoneticiPanel />
              </PrivateRoute>
            }
          />
          <Route path="/yonetici/pdf-indir" element={<YoneticiPdfIndir />} />
          <Route
            path="/yonetici/juri-atama"
            element={
              <PrivateRoute allowRoles={['yonetici']}>
                <JuriAtama />
              </PrivateRoute>
            }
          />
          <Route path="/yonetici/basvurular" element={<YoneticiBasvurular />} />
          <Route
            path="/yonetici/basvurular"
            element={
              <PrivateRoute allowRoles={['yonetici']}>
                <YoneticiBasvurular />
              </PrivateRoute>
            }
          />

          <Route path="/yonetici/pdf-indir" element={<YoneticiPdfIndir />} />

          <Route path="/yonetici/basvurular/:ilanId" element={<YoneticiBasvuruDetay />} />

          <Route
            path="/yonetici/basvurular/:ilanId"
            element={
              <PrivateRoute allowRoles={['yonetici']}>
                <YoneticiBasvuruDetay />
              </PrivateRoute>
            }
          />


          <Route
            path="/makaleler"
            element={
              <PrivateRoute allowRoles={['aday', 'admin']}>
                <Makaleler />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <PrivateRoute allowRoles={['admin']}>
                <AdminUsers />
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
              <PrivateRoute allowRoles={['aday']}>
                <ArastirmaProjeleri />
              </PrivateRoute>
            }
          />
          <Route
            path="/DergiEditörlük"
            element={
              <PrivateRoute allowRoles={['aday']}>
                <DergiEditorluk />
              </PrivateRoute>
            }
          />
          <Route
            path="/basarılar"
            element={
              <PrivateRoute allowRoles={['aday']}>
                <Basarılar />
              </PrivateRoute>
            }
          />
          <Route
            path="/Gorevler"
            element={
              <PrivateRoute allowRoles={['aday']}>
                <Gorevler />
              </PrivateRoute>
            }
          />
          <Route
            path="/Sanat"
            element={
              <PrivateRoute allowRoles={['aday']}>
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
            <PrivateRoute allowRoles={['juri', 'admin']}>
              <JuriPanel />
            </PrivateRoute>
          } />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
