import { Platform } from 'react-native';

/**
 * Tiện ích chọn ảnh trực tiếp từ máy tính hoặc điện thoại của người dùng.
 * Hỗ trợ nén ảnh tự động qua Canvas để tối ưu bộ nhớ & hiển thị nhanh chóng.
 */
export function pickImageFromFile(
  onSuccess: (dataUrl: string, fileName?: string) => void,
  onError?: (errorMsg: string) => void
) {
  if (typeof document === 'undefined') {
    const msg = 'Tính năng chọn ảnh từ máy khả dụng trên trình duyệt web và thiết bị di động.';
    if (onError) onError(msg);
    else alert(msg);
    return;
  }

  // Tạo thẻ input file ẩn
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.style.position = 'fixed';
  input.style.top = '-1000px';
  input.style.left = '-1000px';
  input.style.opacity = '0';
  document.body.appendChild(input);

  input.onchange = (e: any) => {
    const file = e.target?.files?.[0];
    if (!file) {
      if (document.body.contains(input)) document.body.removeChild(input);
      return;
    }

    // Đọc file thành chuỗi Data URL
    const reader = new FileReader();
    reader.onload = (event) => {
      const rawDataUrl = event.target?.result as string;
      if (!rawDataUrl) {
        if (document.body.contains(input)) document.body.removeChild(input);
        return;
      }

      // Tự động nén ảnh qua canvas nếu ảnh quá lớn (> 1200px)
      try {
        const img = new (window as any).Image();
        img.onload = () => {
          const maxWidth = 1200;
          const maxHeight = 1200;
          let width = img.width;
          let height = img.height;

          if (width > maxWidth || height > maxHeight) {
            if (width > height) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            } else {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const compressed = canvas.toDataURL('image/jpeg', 0.88);
            onSuccess(compressed, file.name);
          } else {
            onSuccess(rawDataUrl, file.name);
          }
          if (document.body.contains(input)) document.body.removeChild(input);
        };

        img.onerror = () => {
          onSuccess(rawDataUrl, file.name);
          if (document.body.contains(input)) document.body.removeChild(input);
        };

        img.src = rawDataUrl;
      } catch (err) {
        onSuccess(rawDataUrl, file.name);
        if (document.body.contains(input)) document.body.removeChild(input);
      }
    };

    reader.onerror = () => {
      if (onError) onError('Không thể đọc tệp ảnh từ thiết bị.');
      if (document.body.contains(input)) document.body.removeChild(input);
    };

    reader.readAsDataURL(file);
  };

  // Kích hoạt hộp thoại chọn tệp của hệ điều hành
  input.click();
}
