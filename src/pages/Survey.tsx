import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Logo } from '../components/Logo';
import { Send, Loader2, MapPin, Mail, Phone } from 'lucide-react';

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzZugKOAijsTXHiHSqw3jfJXIKbbd3GvKGpfIBk181FJan1Ycg0oZfJNQ-p9eURUloFKQ/exec";

const QUESTIONS = [
  { id: 'q1', text: 'Nhân viên hướng dẫn thủ tục rõ ràng, dễ hiểu và nhiệt tình.' },
  { id: 'q2', text: 'Không gian tham vấn thoải mái, bảo đảm riêng tư bí mật.' },
  { id: 'q3', text: 'Chi phí tham vấn đáp ứng nhu cầu.' },
  { id: 'q4', text: 'Chuyên gia biết lắng nghe, gợi mở vấn đề và chia sẻ tận tình trách nhiệm.' },
  { id: 'q5', text: 'Đánh giá chung của anh/ chị về chuyên gia tham vấn.' },
];

const RATINGS = [
  { value: 5, label: 'Rất hài lòng' },
  { value: 4, label: 'Hài lòng' },
  { value: 3, label: 'Bình thường' },
  { value: 2, label: 'Không hài lòng' },
  { value: 1, label: 'Rất không hài lòng' },
];

export default function Survey() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);
  
  const [companies, setCompanies] = useState<string[]>([
    "Colgate", "TKE", "Article", "Mega We Care", "Robert Walters", "Datacolor", "Khách vãng lai"
  ]);
  const [topics, setTopics] = useState<string[]>([
    "Áp lực công việc", "Hôn nhân gia đình", "Phát triển bản thân", "Cải thiện mối quan hệ", 
    "Kỹ năng nghề nghiệp", "LGBT", "Rối loạn lo âu trầm cảm", "Tình cảm – tình yêu", "Khủng hoảng cá nhân", "Khác"
  ]);
  const [experts, setExperts] = useState<string[]>([
    "Chuyên gia A", "Chuyên gia B", "Chuyên gia C"
  ]);

  useEffect(() => {
    fetch(`${SCRIPT_URL}?action=getOptions`)
      .then(res => res.json())
      .then(data => {
        if (data.companies && data.companies.length > 0) setCompanies(data.companies);
        if (data.topics && data.topics.length > 0) setTopics(data.topics);
        if (data.experts && data.experts.length > 0) setExperts(data.experts);
      })
      .catch(err => console.error("Lỗi khi tải danh sách tùy chọn:", err))
      .finally(() => setIsLoadingOptions(false));
  }, []);

  const [formData, setFormData] = useState({
    customerName: '',
    consultDate: '',
    expertName: '',
    topic: '',
    company: '',
    q1: '',
    q2: '',
    q3: '',
    q4: '',
    q5: '',
    otherComments: '',
    source: '',
    recommend: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (questionId: string, value: number) => {
    setFormData(prev => ({ ...prev, [questionId]: value.toString() }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const scriptUrl = "https://script.google.com/macros/s/AKfycbzZugKOAijsTXHiHSqw3jfJXIKbbd3GvKGpfIBk181FJan1Ycg0oZfJNQ-p9eURUloFKQ/exec";

    try {
      await fetch(scriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      navigate('/success');
    } catch (error) {
      console.error("Lỗi khi gửi form:", error);
      alert("Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại sau.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e8f4f7] via-[#f4f9fa] to-white py-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-[#1992b0] selection:text-white">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-5xl mx-auto bg-white/95 backdrop-blur-xl rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(25,146,176,0.2)] overflow-hidden border border-white"
      >
        {/* Header */}
        <div className="relative bg-white p-8 md:p-14 border-b border-gray-100 flex flex-col-reverse md:flex-row justify-between items-center gap-10 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2.5 bg-gradient-to-r from-[#1992b0] via-[#20a4c5] to-[#ff9500]"></div>
          
          <div className="z-10 text-center md:text-left space-y-5">
            <h1 className="text-2xl md:text-3xl font-black text-[#1992b0] uppercase tracking-tight drop-shadow-sm">Viện Tâm Lý SunnyCare</h1>
            <div className="text-sm md:text-base text-gray-600 space-y-3 font-medium">
              <p className="flex items-center justify-center md:justify-start gap-3 group">
                <span className="bg-[#fff4e5] p-2 rounded-lg group-hover:bg-[#ff9500] transition-colors duration-300"><MapPin className="w-4 h-4 text-[#ff9500] group-hover:text-white transition-colors duration-300"/></span>
                208 Nguyễn Hữu Cảnh, P. Thạnh Mỹ Tây, TPHCM
              </p>
              <p className="flex items-center justify-center md:justify-start gap-3 group">
                <span className="bg-[#fff4e5] p-2 rounded-lg group-hover:bg-[#ff9500] transition-colors duration-300"><Mail className="w-4 h-4 text-[#ff9500] group-hover:text-white transition-colors duration-300"/></span>
                infoasst@sunnycare.vn | sunnycare.vn
              </p>
              <p className="flex items-center justify-center md:justify-start gap-3 group">
                <span className="bg-[#fff4e5] p-2 rounded-lg group-hover:bg-[#ff9500] transition-colors duration-300"><Phone className="w-4 h-4 text-[#ff9500] group-hover:text-white transition-colors duration-300"/></span>
                028 7300 6848 – 089 639 7968
              </p>
            </div>
          </div>
          
          <div className="z-10 md:mr-8 md:pl-8">
            <Logo />
          </div>
          
          {/* Decorative blob */}
          <div className="absolute -right-32 -top-32 w-96 h-96 bg-gradient-to-br from-[#1992b0]/10 to-[#ff9500]/5 rounded-full blur-3xl pointer-events-none"></div>
        </div>

        <div className="p-8 md:p-14">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#1992b0] to-[#157a93] uppercase tracking-wide mb-4">Ý Kiến Khách Hàng</h2>
            <p className="text-lg md:text-xl text-gray-500 font-semibold tracking-wide">VỀ CHẤT LƯỢNG DỊCH VỤ THAM VẤN</p>
            <div className="w-24 h-1.5 bg-gradient-to-r from-[#ff9500] to-[#ffaa33] mx-auto mt-6 rounded-full shadow-sm"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-12">
            {/* Phần I: Thông tin khách hàng */}
            <section className="bg-white rounded-[2rem] p-6 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:shadow-[0_8px_30px_rgba(25,146,176,0.08)] transition-shadow duration-300">
              <div className="flex items-center gap-4 mb-8">
                <div className="bg-gradient-to-br from-[#1992b0] to-[#157a93] text-white w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg shadow-[#1992b0]/30 transform -rotate-3">I</div>
                <h3 className="text-2xl font-bold text-gray-800 tracking-tight">THÔNG TIN KHÁCH HÀNG</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div className="space-y-2.5">
                  <label className="block text-sm font-bold text-gray-700">
                    TÊN KHÁCH HÀNG <span className="text-gray-400 font-medium italic">(có thể ghi bí danh)</span>
                  </label>
                  <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleChange}
                    className="w-full px-5 py-4 bg-gray-50/50 rounded-xl border border-gray-200 focus:bg-white focus:ring-4 focus:ring-[#1992b0]/10 focus:border-[#1992b0] transition-all duration-200 font-medium text-gray-900"
                    placeholder="Nhập tên của bạn..."
                  />
                </div>

                <div className="space-y-2.5">
                  <label className="block text-sm font-bold text-gray-700">Ngày tham vấn <span className="text-red-500">*</span></label>
                  <input
                    type="date"
                    name="consultDate"
                    required
                    value={formData.consultDate}
                    onChange={handleChange}
                    className="w-full px-5 py-4 bg-gray-50/50 rounded-xl border border-gray-200 focus:bg-white focus:ring-4 focus:ring-[#1992b0]/10 focus:border-[#1992b0] transition-all duration-200 font-medium text-gray-900"
                  />
                </div>

                <div className="space-y-2.5">
                  <label className="block text-sm font-bold text-gray-700">Chuyên gia tham vấn <span className="text-red-500">*</span></label>
                  <select
                    name="expertName"
                    required
                    value={formData.expertName}
                    onChange={handleChange}
                    className="w-full px-5 py-4 bg-gray-50/50 rounded-xl border border-gray-200 focus:bg-white focus:ring-4 focus:ring-[#1992b0]/10 focus:border-[#1992b0] transition-all duration-200 font-medium text-gray-900 appearance-none cursor-pointer"
                  >
                    <option value="" disabled>-- Chọn chuyên gia --</option>
                    {experts.map(e => (
                      <option key={e} value={e}>{e}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2.5">
                  <label className="block text-sm font-bold text-gray-700">Bạn thuộc công ty (EAP) <span className="text-red-500">*</span></label>
                  <select
                    name="company"
                    required
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-5 py-4 bg-gray-50/50 rounded-xl border border-gray-200 focus:bg-white focus:ring-4 focus:ring-[#1992b0]/10 focus:border-[#1992b0] transition-all duration-200 font-medium text-gray-900 appearance-none cursor-pointer"
                  >
                    <option value="" disabled>-- Chọn công ty --</option>
                    {companies.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2.5 md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700">Lĩnh vực tham vấn <span className="text-red-500">*</span></label>
                  <select
                    name="topic"
                    required
                    value={formData.topic}
                    onChange={handleChange}
                    className="w-full px-5 py-4 bg-gray-50/50 rounded-xl border border-gray-200 focus:bg-white focus:ring-4 focus:ring-[#1992b0]/10 focus:border-[#1992b0] transition-all duration-200 font-medium text-gray-900 appearance-none cursor-pointer"
                  >
                    <option value="" disabled>-- Chọn lĩnh vực --</option>
                    {topics.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>
            </section>

            {/* Phần II: Ý kiến khách hàng */}
            <section className="bg-white rounded-[2rem] p-6 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:shadow-[0_8px_30px_rgba(25,146,176,0.08)] transition-shadow duration-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-gradient-to-br from-[#1992b0] to-[#157a93] text-white w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg shadow-[#1992b0]/30 transform -rotate-3">II</div>
                <h3 className="text-2xl font-bold text-gray-800 tracking-tight">Ý KIẾN KHÁCH HÀNG</h3>
              </div>
              <p className="text-gray-500 mb-8 font-medium italic bg-[#e8f4f7]/50 p-4 rounded-xl border border-[#1992b0]/10">
                Để nâng cao chất lượng tham vấn tốt hơn nữa, chúng tôi xin ghi nhận mọi chia sẻ, góp ý quý báu của quý khách. Qúy khách vui lòng đánh giá mức độ hài lòng theo từng mục dưới đây:
              </p>

              <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm bg-white">
                <table className="w-full text-sm text-left min-w-[800px]">
                  <thead className="bg-gradient-to-r from-[#1992b0] to-[#157a93] text-white">
                    <tr>
                      <th className="px-4 py-5 font-bold text-center w-16 border-r border-white/20">STT</th>
                      <th className="px-6 py-5 font-bold border-r border-white/20 text-base">Nội dung</th>
                      {RATINGS.map(r => (
                        <th key={r.value} className="px-2 py-5 font-bold text-center w-24 border-r border-white/20 last:border-0 leading-tight">
                          {r.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {QUESTIONS.map((q, index) => (
                      <tr key={q.id} className="hover:bg-[#f4f9fa] transition-colors duration-150 group">
                        <td className="px-4 py-5 text-center font-bold text-gray-400 border-r border-gray-100 group-hover:text-[#1992b0] transition-colors">{index + 1}</td>
                        <td className="px-6 py-5 text-gray-800 font-medium border-r border-gray-100 text-base leading-relaxed">{q.text}</td>
                        {RATINGS.map(r => (
                          <td key={r.value} className="px-2 py-5 text-center border-r border-gray-100 last:border-0">
                            <label className="flex items-center justify-center cursor-pointer w-full h-full relative">
                              <input
                                type="radio"
                                name={q.id}
                                value={r.value}
                                required
                                checked={formData[q.id as keyof typeof formData] === r.value.toString()}
                                onChange={() => handleRatingChange(q.id, r.value)}
                                className="peer sr-only"
                              />
                              <div className="w-6 h-6 rounded-full border-2 border-gray-300 peer-checked:border-[#ff9500] peer-checked:bg-[#ff9500] transition-all duration-200 flex items-center justify-center shadow-sm peer-hover:border-[#ff9500]/50">
                                <div className="w-2.5 h-2.5 rounded-full bg-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200 transform scale-50 peer-checked:scale-100"></div>
                              </div>
                            </label>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Phần III: Thông tin thêm */}
            <section className="bg-gradient-to-br from-gray-50 to-white rounded-[2rem] p-6 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
              <div className="space-y-3 mb-8">
                <label className="block text-base font-bold text-[#1992b0] uppercase tracking-wide">Ý KIẾN KHÁC:</label>
                <textarea
                  name="otherComments"
                  value={formData.otherComments}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-5 py-4 bg-white rounded-xl border border-gray-200 focus:ring-4 focus:ring-[#1992b0]/10 focus:border-[#1992b0] transition-all duration-200 resize-none font-medium text-gray-900 shadow-sm"
                  placeholder="Chia sẻ thêm cảm nhận hoặc góp ý của bạn..."
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-gray-200">
                <div className="space-y-3">
                  <label className="block text-sm font-bold text-gray-700">Bạn biết đến SunnyCare qua kênh nào?</label>
                  <select
                    name="source"
                    value={formData.source}
                    onChange={handleChange}
                    className="w-full px-5 py-4 bg-white rounded-xl border border-gray-200 focus:ring-4 focus:ring-[#1992b0]/10 focus:border-[#1992b0] transition-all duration-200 font-medium text-gray-900 appearance-none cursor-pointer shadow-sm"
                  >
                    <option value="">-- Chọn nguồn --</option>
                    <option value="Facebook">Facebook</option>
                    <option value="Google">Google Search</option>
                    <option value="Bạn bè giới thiệu">Bạn bè/Người thân giới thiệu</option>
                    <option value="Công ty (EAP)">Công ty (EAP)</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-bold text-gray-700">Bạn có sẵn sàng giới thiệu dịch vụ cho người thân/bạn bè không?</label>
                  <div className="flex gap-8 mt-2">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative flex items-center">
                        <input type="radio" name="recommend" value="Có" onChange={handleChange} className="peer sr-only" />
                        <div className="w-6 h-6 rounded-full border-2 border-gray-300 peer-checked:border-[#ff9500] peer-checked:bg-[#ff9500] transition-all duration-200 flex items-center justify-center group-hover:border-[#ff9500]/50">
                          <div className="w-2.5 h-2.5 rounded-full bg-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200"></div>
                        </div>
                      </div>
                      <span className="font-medium text-gray-700 group-hover:text-gray-900 transition-colors">Có, chắc chắn</span>
                    </label>
                    
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative flex items-center">
                        <input type="radio" name="recommend" value="Không" onChange={handleChange} className="peer sr-only" />
                        <div className="w-6 h-6 rounded-full border-2 border-gray-300 peer-checked:border-[#ff9500] peer-checked:bg-[#ff9500] transition-all duration-200 flex items-center justify-center group-hover:border-[#ff9500]/50">
                          <div className="w-2.5 h-2.5 rounded-full bg-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200"></div>
                        </div>
                      </div>
                      <span className="font-medium text-gray-700 group-hover:text-gray-900 transition-colors">Không</span>
                    </label>
                  </div>
                </div>
              </div>
            </section>

            {/* Submit */}
            <div className="pt-8 flex flex-col items-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative inline-flex items-center justify-center px-10 py-5 text-xl font-black text-white transition-all duration-300 bg-gradient-to-r from-[#ff9500] to-[#ffaa33] rounded-full hover:from-[#e68600] hover:to-[#ff9500] focus:outline-none focus:ring-4 focus:ring-[#ff9500]/30 shadow-[0_10px_30px_rgba(255,149,0,0.4)] hover:shadow-[0_15px_40px_rgba(255,149,0,0.5)] hover:-translate-y-1.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none overflow-hidden"
              >
                <div className="absolute inset-0 w-full h-full bg-white/20 group-hover:translate-x-full transition-transform duration-500 ease-out -skew-x-12 -ml-8"></div>
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-7 h-7 mr-3 animate-spin" />
                    Đang gửi...
                  </>
                ) : (
                  <>
                    <Send className="w-6 h-6 mr-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                    GỬI ĐÁNH GIÁ
                  </>
                )}
              </button>
              
              <p className="text-center text-gray-500 font-medium italic mt-6">
                Cảm ơn sự chia sẻ của quý khách hàng!
              </p>
            </div>
          </form>
        </div>
      </motion.div>

      {/* Footer with subtle Admin link */}
      <div className="mt-8 text-center pb-8">
        <Link to="/admin" className="text-sm text-gray-400 hover:text-[#1992b0] transition-colors">
          Đăng nhập Quản trị viên
        </Link>
      </div>
    </div>
  );
}
