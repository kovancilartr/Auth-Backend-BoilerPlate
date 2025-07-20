# Auth System - Postman Collection

Bu klasörde Auth System API'sini test etmek için hazırlanmış Postman koleksiyonları bulunmaktadır.

## Dosyalar

### 1. `Auth-System-Environment.json`
Environment variables dosyası. Tüm API endpoint'lerinde kullanılacak değişkenleri içerir.

**Önemli değişkenler:**
- `baseUrl`: API base URL (default: http://localhost:3000)
- `accessToken`: JWT access token (otomatik set edilir)
- `refreshToken`: JWT refresh token (otomatik set edilir)
- `userId`: Mevcut kullanıcı ID'si
- `userEmail`: Test kullanıcı email'i
- `adminEmail`: Admin kullanıcı email'i

### 2. `Auth-System-Postman-Collection.json`
Ana API koleksiyonu. Tüm endpoint'leri içerir:

**Kategoriler:**
- **Authentication**: Register, Login, Refresh Token, Profile, Logout
- **Password & Email**: Forgot Password, Reset Password, Email Verification
- **User Management**: Admin-only user operations
- **Audit Logs**: Activity tracking endpoints
- **Health Check**: System health endpoint

### 3. `Admin-Test-Scenarios.json`
Admin işlemleri için hazır test senaryoları.

## Kurulum

### 1. Environment Import
1. Postman'i açın
2. Environments sekmesine gidin
3. "Import" butonuna tıklayın
4. `Auth-System-Environment.json` dosyasını seçin
5. Environment'ı aktif hale getirin

### 2. Collection Import
1. Collections sekmesine gidin
2. "Import" butonuna tıklayın
3. `Auth-System-Postman-Collection.json` dosyasını seçin
4. İsteğe bağlı: `Admin-Test-Scenarios.json` dosyasını da import edin

## Kullanım

### Temel Test Akışı

1. **Health Check** ile sistem durumunu kontrol edin
2. **Register User** ile yeni kullanıcı oluşturun
3. **Login User** ile giriş yapın (token otomatik set edilir)
4. **Get Profile** ile profil bilgilerini görüntüleyin
5. Diğer endpoint'leri test edin

### Admin Test Akışı

1. **Admin Setup > Login as Admin** ile admin olarak giriş yapın
2. **Complete User Management Flow** klasöründeki testleri sırayla çalıştırın

### Otomatik Token Yönetimi

Koleksiyon otomatik token yönetimi içerir:
- Login/Register sonrası token'lar otomatik environment'a kaydedilir
- Refresh token endpoint'i yeni token'ları otomatik günceller
- Tüm authenticated endpoint'ler otomatik token kullanır

### Environment Variables

Test sırasında bu değişkenleri güncelleyebilirsiniz:

```
userEmail: test@example.com
userPassword: password123
adminEmail: admin@example.com
adminPassword: password123
newRole: MODERATOR
targetUserId: (otomatik set edilir)
```

### Filter Örnekleri

Audit logs endpoint'lerinde filter kullanımı:

```
# Sadece başarılı işlemler
?success=true

# Belirli bir action
?action=USER_LOGIN

# Belirli bir kullanıcının işlemleri
?userId=user_id_here

# Tarih aralığı
?startDate=2025-01-01&endDate=2025-01-31
```

## Test Senaryoları

### 1. Authentication Flow
- User registration
- User login
- Token refresh
- Profile access
- Logout operations

### 2. Password Management
- Forgot password request
- Password reset (token gerekli)
- Email verification

### 3. Admin Operations
- User listing
- Role management
- User status toggle
- User deletion
- System audit logs

### 4. Security Tests
- Unauthorized access attempts
- Invalid token usage
- Role-based access control

## Troubleshooting

### Token Expired
Eğer 401 hatası alıyorsanız:
1. **Refresh Token** endpoint'ini çalıştırın
2. Veya yeniden **Login** yapın

### Permission Denied
403 hatası için:
1. Kullanıcı role'ünü kontrol edin
2. Admin işlemleri için admin hesabıyla giriş yapın

### Environment Issues
Değişkenler set edilmiyorsa:
1. Environment'ın aktif olduğunu kontrol edin
2. Test script'lerinin çalıştığını kontrol edin

## API Documentation

Detaylı API dokümantasyonu için endpoint'lerin description kısımlarını kontrol edin. Her endpoint için:
- Request format
- Response format
- Required headers
- Error codes
- Example usage

## Support

Sorun yaşarsanız:
1. Console log'larını kontrol edin
2. Environment variables'ları kontrol edin
3. Server'ın çalıştığından emin olun (http://localhost:3000/health)