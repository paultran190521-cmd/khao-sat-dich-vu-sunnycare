import React from 'react';
import { X, Copy, Check } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  gasUrl: string;
  setGasUrl: (url: string) => void;
}

export function GasInstructions({ isOpen, onClose, gasUrl, setGasUrl }: Props) {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(gasUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex justify-between items-center z-10">
          <h2 className="text-2xl font-bold text-[#1992b0]">Cài đặt Google Sheets</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="bg-[#fff4e5] border border-[#ff9500]/30 rounded-xl p-4 text-[#b36800]">
            <p className="font-semibold mb-1">Lưu ý quan trọng:</p>
            <p className="text-sm">Hệ thống sử dụng Google Sheets làm cơ sở dữ liệu. Bạn cần tạo một file Google Sheets và gắn mã Apps Script để hệ thống có thể lưu và đọc dữ liệu.</p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Các bước thực hiện:</h3>
            <ol className="list-decimal list-inside space-y-3 text-gray-700">
              <li>Truy cập <a href="https://docs.google.com/spreadsheets/" target="_blank" rel="noreferrer" className="text-[#1992b0] hover:underline font-medium">Google Sheets</a> và tạo một bảng tính mới.</li>
              <li>Trên thanh menu, chọn <strong>Tiện ích mở rộng (Extensions)</strong> &gt; <strong>Apps Script</strong>.</li>
              <li>Xóa hết code cũ và copy toàn bộ nội dung từ file <code>google-apps-script.js</code> (ở thư mục gốc của dự án này) dán vào.</li>
              <li>Nhấn nút <strong>Lưu</strong> (biểu tượng đĩa mềm).</li>
              <li>Chọn hàm <code>setup</code> ở thanh công cụ phía trên và nhấn <strong>Chạy (Run)</strong>. Cấp quyền truy cập nếu Google yêu cầu. (Bước này sẽ tự động tạo các cột).</li>
              <li>Nhấn nút <strong>Triển khai (Deploy)</strong> ở góc trên bên phải &gt; <strong>Triển khai mới (New deployment)</strong>.</li>
              <li>Chọn loại là <strong>Ứng dụng web (Web app)</strong>.</li>
              <li>Cấu hình:
                <ul className="list-disc list-inside ml-6 mt-2 space-y-1 text-sm text-gray-600">
                  <li>Thực thi dưới dạng (Execute as): <strong>Tôi (Me)</strong></li>
                  <li>Ai có quyền truy cập (Who has access): <strong>Bất kỳ ai (Anyone)</strong></li>
                </ul>
              </li>
              <li>Nhấn <strong>Triển khai (Deploy)</strong>. Copy <strong>URL ứng dụng web (Web app URL)</strong>.</li>
              <li>Dán URL đó vào ô bên dưới và lưu lại.</li>
            </ol>
          </div>

          <div className="space-y-2 pt-4 border-t border-gray-100">
            <label className="block text-sm font-semibold text-gray-700">Web App URL của bạn:</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={gasUrl}
                onChange={(e) => setGasUrl(e.target.value)}
                placeholder="https://script.google.com/macros/s/..."
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1992b0] focus:border-[#1992b0] transition-colors"
              />
              <button 
                onClick={() => {
                  localStorage.setItem('GAS_URL', gasUrl);
                  alert('Đã lưu URL thành công!');
                  onClose();
                }}
                className="px-6 py-3 bg-[#1992b0] text-white font-bold rounded-lg hover:bg-[#157a93] transition-colors"
              >
                Lưu URL
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
