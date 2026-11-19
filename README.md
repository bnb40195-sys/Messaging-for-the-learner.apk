# المنصة التعليمية الرقمية · ONEFD 2026/2027

تطبيق ويب تقدمي (PWA) وتطبيق أندرويد (Capacitor Android) لبوابة الخدمات التعليمية للديوان الوطني للتعليم والتكوين عن بعد **ONEFD** للموسم الدراسي **2026/2027**.

---

## المميزات الرئيسية

- **الواجهة الرئيسية:**
  - عدّاد تنازلي ديناميكي بالأيام لامتحان إثبات المستوى (دورة ماي 2027).
  - رزنامة التقويمات التكوينية الرسمية 2026/2027 مع تفاصيل المحطات الخمس ومعاينة مكبّرة.
  - إعلان انطلاق المرافقة البيداغوجية والنفسية (02 نوفمبر 2026) مع معاينة مكبّرة.
- **الإشعارات الفورية الحقيقية (Firebase):**
  - زر الإشعارات في الشريط العلوي لتلقي تنبيهات الامتحانات والفروض في الوقت الفعلي.
  - تبويب خاص بالمشرف لإرسال وحذف الإشعارات بعد التحقق عبر تسجيل الدخول بحساب Google المعتمد.
- **العمل الكامل بدون إنترنت (PWA):**
  - حفظ صفحات التطبيق والرزنامات والصور والبيانات محلياً، مع دعم التثبيت المباشر على الهاتف والكمبيوتر.
- **النافذة الجانبية والأقسام:**
  - الأرضيات التعليمية (المعلام) للمتوسط والثانوي.
  - تسجيل الدخول (متعلم سابق / متعلم جديد).
  - سحب الوثائق (إعادة طبع الوثائق، رقم التسجيل، وأي استفسار مع فتح المواقع الرسمية مباشرة).
  - الفرض الإلكتروني الرسمي.

---

## إنشاء ونشر ملف APK للتصحيح (Debug APK) تلقائياً عبر GitHub

يحتوي المشروع على مسار عمل تلقائي جاهز في:
`.github/workflows/build-apk.yml`

### خطوات الإنشاء والنشر على GitHub Releases:

1. **رفع المشروع إلى مستودع GitHub:**
   ```bash
   git add .
   git commit -m "Prepare Android Debug APK & GitHub Actions workflow"
   git branch -M main
   git remote add origin https://github.com/<USERNAME>/<REPO>.git
   git push -u origin main
   ```
2. **بدء البناء التلقائي:**
   - بمجرد الرفع إلى فرع `main` أو `master` (أو عبر تبويب **Actions** ← **Build & Release Android Debug APK** ← **Run workflow**)، سيقوم GitHub Actions تلقائياً بـ:
     1. تثبيت حزم Node.js وبناء واجهة الويب (`npm run build`).
     2. مزامنة مشروع أندرويد (`npx cap sync android`).
     3. تجهيز **Java 21** و **Android SDK**.
     4. بناء ملف التصحيح عبر Gradle (`./gradlew assembleDebug`).
     5. رفع الملف كـ **Artifact** باسم `onefd-platform-debug-apk`.
     6. نشر إصدار جديد تلقائياً في **GitHub Releases** وإرفاق ملف `onefd-platform-debug.apk`.
3. **رابط التحميل المباشر لآخر ملف APK:**
   بعد انتهاء أول عملية بناء بنجاح، يمكنك تحميل ملف التصحيح مباشرة من قسم **Releases** في المستودع أو عبر الرابط:
   ```text
   https://github.com/<USERNAME>/<REPO>/releases/latest/download/onefd-platform-debug.apk
   ```

---

## البناء والتشغيل المحلي

### تشغيل نسخة الويب للتطوير:
```bash
npm install
npm run dev
```

### بناء ملف APK للتصحيح محلياً (يتطلب JDK 21 و Android SDK):
```bash
npm install
npm run build
npx cap sync android
cd android
./gradlew assembleDebug
```
سيتم توليد الملف في:
`android/app/build/outputs/apk/debug/app-debug.apk`
