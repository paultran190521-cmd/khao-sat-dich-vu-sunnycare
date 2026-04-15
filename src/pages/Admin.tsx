import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { Logo } from '../components/Logo';
import { 
  Users, MessageSquare, LogOut, RefreshCw, AlertCircle, 
  LayoutDashboard, Star, Building, Menu, BarChart3, Filter, Download, FileText, Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import * as XLSX from 'xlsx';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzZugKOAijsTXHiHSqw3jfJXIKbbd3GvKGpfIBk181FJan1Ycg0oZfJNQ-p9eURUloFKQ/exec";

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  
  const [loginCompany, setLoginCompany] = useState('');
  const [role, setRole] = useState('');
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const savedLogin = localStorage.getItem('sunnycare_admin_login');
    if (savedLogin) {
      try {
        const parsed = JSON.parse(savedLogin);
        if (parsed.company && parsed.role) {
          setLoginCompany(parsed.company);
          setRole(parsed.role);
          setIsLoggedIn(true);
        }
      } catch (e) {
        console.error('Lỗi đọc dữ liệu đăng nhập:', e);
      }
    }
  }, []);
  
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, guests: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  // Auth Modals State
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [forgotUsername, setForgotUsername] = useState('');
  const [isForgotLoading, setIsForgotLoading] = useState(false);

  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangeLoading, setIsChangeLoading] = useState(false);

  // Filters
  const [filterCompany, setFilterCompany] = useState('all');
  const [filterTopic, setFilterTopic] = useState('all');
  const [filterExpert, setFilterExpert] = useState('all');
  const [filterRating, setFilterRating] = useState('all');
  const [filterTime, setFilterTime] = useState('all');

  const exportToExcel = () => {
    const dataToExport = filteredFeedbacks.map(fb => ({
      'Thời gian': new Date(fb.timestamp).toLocaleString('vi-VN'),
      'Khách hàng': fb.customerName || 'Ẩn danh',
      'Công ty': fb.company,
      'Ngày tham vấn': fb.consultDate,
      'Chuyên gia': fb.expertName,
      'Lĩnh vực': fb.topic,
      'Q1 (Hướng dẫn)': fb.q1,
      'Q2 (Không gian)': fb.q2,
      'Q3 (Chi phí)': fb.q3,
      'Q4 (Lắng nghe)': fb.q4,
      'Q5 (Đánh giá chung)': fb.q5,
      'Ý kiến khác': fb.otherComments,
      'Nguồn biết đến': fb.source,
      'Giới thiệu': fb.recommend
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Phản hồi");
    XLSX.writeFile(wb, `SunnyCare_BaoCao_${new Date().toISOString().slice(0,10)}.xlsx`);
  };

  const exportToPDF = async () => {
    if (!reportRef.current) return;
    setIsExportingPDF(true);
    try {
      const dataUrl = await toPng(reportRef.current, { cacheBust: true, pixelRatio: 2 });
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      
      // Calculate height based on aspect ratio
      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`SunnyCare_BaoCao_BieuDo_${new Date().toISOString().slice(0,10)}.pdf`);
    } catch (err) {
      console.error("Lỗi xuất PDF:", err);
      alert("Có lỗi xảy ra khi xuất PDF.");
    } finally {
      setIsExportingPDF(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    try {
      const response = await fetch(`${SCRIPT_URL}?action=login&username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`);
      const data = await response.json();
      
      if (data.status === 'success') {
        setIsLoggedIn(true);
        setLoginCompany(data.company);
        setRole(data.role);
        
        if (rememberMe) {
          localStorage.setItem('sunnycare_admin_login', JSON.stringify({
            company: data.company,
            role: data.role
          }));
        }
      } else {
        alert(data.message || 'Đăng nhập thất bại');
      }
    } catch (err) {
      console.error(err);
      alert('Lỗi kết nối. Vui lòng kiểm tra lại mạng.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotUsername) return;

    setIsForgotLoading(true);
    try {
      const response = await fetch(`${SCRIPT_URL}?action=forgotPassword&username=${encodeURIComponent(forgotUsername)}`);
      const data = await response.json();
      
      if (data.status === 'success') {
        alert('Gửi yêu cầu thành công! Vui lòng kiểm tra email để nhận mật khẩu mới. Bạn nên đổi lại mật khẩu theo ý muốn ngay sau khi đăng nhập nhé.');
        setIsForgotPasswordOpen(false);
        setForgotUsername('');
      } else {
        alert(data.message || 'Không tìm thấy tài khoản hoặc có lỗi xảy ra.');
      }
    } catch (err) {
      console.error(err);
      alert('Lỗi kết nối. Vui lòng kiểm tra lại mạng.');
    } finally {
      setIsForgotLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('Mật khẩu mới không khớp!');
      return;
    }

    setIsChangeLoading(true);
    try {
      const response = await fetch(`${SCRIPT_URL}?action=changePassword&username=${encodeURIComponent(loginCompany)}&oldPassword=${encodeURIComponent(oldPassword)}&newPassword=${encodeURIComponent(newPassword)}`);
      const data = await response.json();
      
      if (data.status === 'success') {
        alert('Đổi mật khẩu thành công!');
        setIsChangePasswordOpen(false);
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        alert(data.message || 'Đổi mật khẩu thất bại. Vui lòng kiểm tra lại mật khẩu cũ.');
      }
    } catch (err) {
      console.error(err);
      alert('Lỗi kết nối. Vui lòng kiểm tra lại mạng.');
    } finally {
      setIsChangeLoading(false);
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch(`${SCRIPT_URL}?action=getAdminData&company=${encodeURIComponent(loginCompany)}&role=${encodeURIComponent(role)}`);
      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
      } else {
        // Sắp xếp mới nhất lên đầu
        const sortedFeedbacks = (data.feedbacks || []).sort((a: any, b: any) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        setFeedbacks(sortedFeedbacks);
        setStats(data.stats || { total: 0, guests: 0 });
      }
    } catch (err) {
      console.error(err);
      setError('Lỗi kết nối đến Google Sheets.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchData();
    }
  }, [isLoggedIn, loginCompany, role]);

  // Lọc dữ liệu
  const filteredFeedbacks = useMemo(() => {
    return feedbacks.filter(fb => {
      if (filterCompany !== 'all' && fb.company !== filterCompany) return false;
      if (filterTopic !== 'all' && fb.topic !== filterTopic) return false;
      if (filterExpert !== 'all' && fb.expertName !== filterExpert) return false;
      
      const avgFbRating = (Number(fb.q1) + Number(fb.q2) + Number(fb.q3) + Number(fb.q4) + Number(fb.q5)) / 5;
      if (filterRating !== 'all') {
         if (filterRating === '5' && avgFbRating < 4.5) return false;
         if (filterRating === '4' && (avgFbRating < 3.5 || avgFbRating >= 4.5)) return false;
         if (filterRating === '3' && (avgFbRating < 2.5 || avgFbRating >= 3.5)) return false;
         if (filterRating === '2' && (avgFbRating < 1.5 || avgFbRating >= 2.5)) return false;
         if (filterRating === '1' && avgFbRating >= 1.5) return false;
      }

      if (filterTime !== 'all') {
         const fbDate = new Date(fb.timestamp);
         const now = new Date();
         if (filterTime === 'today') {
           if (fbDate.toDateString() !== now.toDateString()) return false;
         } else if (filterTime === 'week') {
           const weekAgo = new Date(now.setDate(now.getDate() - 7));
           if (fbDate < weekAgo) return false;
         } else if (filterTime === 'month') {
           const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
           if (fbDate < monthAgo) return false;
         }
      }
      return true;
    });
  }, [feedbacks, filterCompany, filterTopic, filterExpert, filterRating, filterTime]);

  // Tính toán thống kê thêm dựa trên dữ liệu đã lọc
  const filteredTotal = filteredFeedbacks.length;
  const avgRating = filteredTotal > 0 
    ? (filteredFeedbacks.reduce((acc, curr) => acc + Number(curr.q5 || 0), 0) / filteredTotal).toFixed(1)
    : "0.0";
    
  const filteredGuests = filteredFeedbacks.filter(fb => fb.company === 'Khách vãng lai').length;
  const companyCount = filteredTotal - filteredGuests;

  // Dữ liệu biểu đồ Lĩnh vực
  const topicChartData = useMemo(() => {
    const counts = filteredFeedbacks.reduce((acc, fb) => {
      if (fb.topic) {
        acc[fb.topic] = (acc[fb.topic] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(counts).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [filteredFeedbacks]);

  // Dữ liệu biểu đồ Đánh giá (Mục II)
  const ratingChartData = useMemo(() => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let totalRatings = 0;
    filteredFeedbacks.forEach(fb => {
      [fb.q1, fb.q2, fb.q3, fb.q4, fb.q5].forEach(q => {
        const val = Number(q);
        if (val >= 1 && val <= 5) {
          counts[val as keyof typeof counts]++;
          totalRatings++;
        }
      });
    });
    
    const labels = { 5: 'Rất hài lòng', 4: 'Hài lòng', 3: 'Bình thường', 2: 'Không hài lòng', 1: 'Rất không hài lòng' };
    const colors = { 5: '#10b981', 4: '#3b82f6', 3: '#f59e0b', 2: '#f97316', 1: '#ef4444' };
    
    return Object.entries(counts)
      .map(([key, value]) => ({
        name: labels[Number(key) as keyof typeof labels],
        value,
        percentage: totalRatings > 0 ? ((value / totalRatings) * 100).toFixed(1) : 0,
        color: colors[Number(key) as keyof typeof colors]
      }))
      .reverse();
  }, [filteredFeedbacks]);

  // Lấy danh sách options cho bộ lọc
  const uniqueCompanies = useMemo(() => Array.from(new Set(feedbacks.map(f => f.company).filter(Boolean))), [feedbacks]);
  const uniqueTopics = useMemo(() => Array.from(new Set(feedbacks.map(f => f.topic).filter(Boolean))), [feedbacks]);
  const uniqueExperts = useMemo(() => Array.from(new Set(feedbacks.map(f => f.expertName).filter(Boolean))), [feedbacks]);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4 font-sans relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#1992b0] opacity-20 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#ff9500] opacity-20 blur-[120px]"></div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-2xl p-10 rounded-3xl shadow-2xl w-full max-w-md border border-white/20 z-10"
        >
          <div className="flex justify-center mb-8 bg-white p-4 rounded-2xl shadow-inner">
            <Logo className="scale-90" />
          </div>
          <h2 className="text-2xl font-bold text-center text-white mb-8 tracking-wide">ĐĂNG NHẬP QUẢN TRỊ</h2>
          
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-blue-100">Tài khoản (Tên công ty)</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-5 py-4 bg-white/5 rounded-xl border border-white/10 text-white placeholder-white/30 focus:bg-white/10 focus:ring-2 focus:ring-[#1992b0] focus:border-transparent transition-all"
                placeholder="Nhập tài khoản..."
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-blue-100">Mật khẩu</label>
                <button 
                  type="button" 
                  onClick={() => setIsForgotPasswordOpen(true)}
                  className="text-sm text-[#ff9500] hover:text-[#ffaa33] transition-colors"
                >
                  Quên mật khẩu?
                </button>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-4 bg-white/5 rounded-xl border border-white/10 text-white placeholder-white/30 focus:bg-white/10 focus:ring-2 focus:ring-[#1992b0] focus:border-transparent transition-all"
                placeholder="Nhập mật khẩu..."
              />
            </div>

            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-[#1992b0] bg-white/5 border-white/20 rounded focus:ring-[#1992b0] focus:ring-2"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-blue-100">
                Ghi nhớ đăng nhập
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-[#1992b0] to-[#157a93] text-white font-bold rounded-xl hover:shadow-[0_0_20px_rgba(25,146,176,0.4)] transition-all mt-6 disabled:opacity-70 uppercase tracking-wider"
            >
              {isLoading ? 'Đang xác thực...' : 'Đăng nhập'}
            </button>
          </form>
        </motion.div>

        {/* Forgot Password Modal */}
        {isForgotPasswordOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Quên mật khẩu</h3>
              <p className="text-gray-500 mb-6">Nhập tên tài khoản hoặc email của bạn. Chúng tôi sẽ gửi mật khẩu mới về email đã đăng ký.</p>
              
              <form onSubmit={handleForgotPassword} className="space-y-5">
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700">Tài khoản hoặc Email</label>
                  <input
                    type="text"
                    required
                    value={forgotUsername}
                    onChange={(e) => setForgotUsername(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:bg-white focus:ring-2 focus:ring-[#1992b0] focus:border-transparent transition-all"
                    placeholder="Nhập tài khoản hoặc email..."
                  />
                </div>
                
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsForgotPasswordOpen(false)}
                    className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={isForgotLoading}
                    className="flex-1 py-3 px-4 bg-[#1992b0] text-white font-bold rounded-xl hover:bg-[#157a93] transition-colors disabled:opacity-70 flex justify-center items-center gap-2"
                  >
                    {isForgotLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                    Gửi yêu cầu
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-72 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:flex-shrink-0 flex flex-col`}>
        <div className="h-20 flex items-center justify-center border-b border-gray-100 px-6">
          <Logo className="scale-75" />
        </div>
        
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Tài khoản</p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1992b0] to-[#157a93] flex items-center justify-center text-white font-bold text-lg shadow-sm">
              {loginCompany.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="font-bold text-[#1992b0] truncate">{loginCompany}</p>
              <p className="text-xs text-[#ff9500] font-medium">{role === 'SuperAdmin' ? 'Super Administrator' : 'Company Admin'}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <a href="#" className="flex items-center gap-3 px-4 py-3 bg-[#e8f4f7] text-[#1992b0] rounded-xl font-medium transition-colors">
            <LayoutDashboard className="w-5 h-5" />
            Tổng quan
          </a>
          <Link to="/" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl font-medium transition-colors">
            <MessageSquare className="w-5 h-5" />
            Xem Form Khảo sát
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-100 space-y-2">
          <button 
            onClick={() => setIsChangePasswordOpen(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-xl font-medium transition-colors"
          >
            Đổi mật khẩu
          </button>
          <button 
            onClick={() => { 
              setIsLoggedIn(false); 
              setPassword(''); 
              setUsername(''); 
              localStorage.removeItem('sunnycare_admin_login');
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl font-medium transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/50 z-30 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-8 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-lg lg:hidden"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 tracking-tight">Dashboard</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={exportToExcel}
              disabled={isLoading || filteredFeedbacks.length === 0}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-[#1992b0] bg-[#e8f4f7] hover:bg-[#d1eef5] rounded-xl transition-all disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Xuất Excel</span>
            </button>
            <button 
              onClick={exportToPDF}
              disabled={isLoading || filteredFeedbacks.length === 0 || isExportingPDF}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-[#ff9500] bg-[#fff4e5] hover:bg-[#ffe4b5] rounded-xl transition-all disabled:opacity-50"
            >
              {isExportingPDF ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
              <span className="hidden sm:inline">Xuất Báo Cáo PDF</span>
            </button>
            <button 
              onClick={fetchData}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-white bg-[#1992b0] hover:bg-[#157a93] rounded-xl transition-all shadow-sm shadow-[#1992b0]/20 disabled:opacity-70"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Làm mới</span>
            </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3 text-red-700 shadow-sm">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Lỗi tải dữ liệu</p>
                  <p className="text-sm mt-1">{error}</p>
                </div>
              </div>
            )}

            {/* Filters */}
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 flex flex-col gap-4">
              <div className="flex items-center gap-2 text-gray-800 font-bold">
                <Filter className="w-5 h-5 text-[#1992b0]" />
                Bộ lọc dữ liệu
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {role === 'SuperAdmin' && (
                  <select 
                    value={filterCompany} 
                    onChange={(e) => setFilterCompany(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1992b0] focus:border-transparent outline-none transition-all text-sm"
                  >
                    <option value="all">Tất cả công ty</option>
                    {uniqueCompanies.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                )}
                
                <select 
                  value={filterTopic} 
                  onChange={(e) => setFilterTopic(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1992b0] focus:border-transparent outline-none transition-all text-sm"
                >
                  <option value="all">Tất cả lĩnh vực</option>
                  {uniqueTopics.map(t => <option key={t} value={t}>{t}</option>)}
                </select>

                <select 
                  value={filterExpert} 
                  onChange={(e) => setFilterExpert(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1992b0] focus:border-transparent outline-none transition-all text-sm"
                >
                  <option value="all">Tất cả chuyên gia</option>
                  {uniqueExperts.map(e => <option key={e} value={e}>{e}</option>)}
                </select>

                <select 
                  value={filterRating} 
                  onChange={(e) => setFilterRating(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1992b0] focus:border-transparent outline-none transition-all text-sm"
                >
                  <option value="all">Mọi mức đánh giá</option>
                  <option value="5">5 Sao (Rất hài lòng)</option>
                  <option value="4">4 Sao (Hài lòng)</option>
                  <option value="3">3 Sao (Bình thường)</option>
                  <option value="2">2 Sao (Không hài lòng)</option>
                  <option value="1">1 Sao (Rất không hài lòng)</option>
                </select>

                <select 
                  value={filterTime} 
                  onChange={(e) => setFilterTime(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1992b0] focus:border-transparent outline-none transition-all text-sm"
                >
                  <option value="all">Mọi thời gian</option>
                  <option value="today">Hôm nay</option>
                  <option value="week">Tuần này</option>
                  <option value="month">Tháng này</option>
                </select>
              </div>
            </div>

            {/* Report Content to be exported to PDF */}
            <div ref={reportRef} className="space-y-8 bg-[#f8fafc] p-2">
              {/* Stats Grid */}
              <div className={`grid grid-cols-1 sm:grid-cols-2 ${role === 'SuperAdmin' ? 'lg:grid-cols-4' : ''} gap-6`}>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between relative overflow-hidden group">
                  <div className="absolute right-[-10px] top-[-10px] w-24 h-24 bg-[#1992b0]/5 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <div className="bg-[#e8f4f7] p-3 rounded-xl text-[#1992b0]">
                      <MessageSquare className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="relative z-10">
                    <p className="text-3xl font-black text-[#ff9500]">{filteredTotal}</p>
                    <p className="text-sm font-medium text-gray-500 mt-1">Tổng phản hồi</p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between relative overflow-hidden group">
                  <div className="absolute right-[-10px] top-[-10px] w-24 h-24 bg-[#ff9500]/5 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <div className="bg-[#fff4e5] p-3 rounded-xl text-[#ff9500]">
                      <Star className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="relative z-10">
                    <p className="text-3xl font-black text-[#ff9500]">{avgRating} <span className="text-lg text-gray-400 font-medium">/ 5.0</span></p>
                    <p className="text-sm font-medium text-gray-500 mt-1">Đánh giá trung bình</p>
                  </div>
                </div>

                {role === 'SuperAdmin' && (
                  <>
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between relative overflow-hidden group">
                      <div className="absolute right-[-10px] top-[-10px] w-24 h-24 bg-blue-50 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
                      <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="bg-blue-50 p-3 rounded-xl text-blue-600">
                          <Building className="w-6 h-6" />
                        </div>
                      </div>
                      <div className="relative z-10">
                        <p className="text-3xl font-black text-[#ff9500]">{companyCount}</p>
                        <p className="text-sm font-medium text-gray-500 mt-1">Khách từ Công ty (EAP)</p>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between relative overflow-hidden group">
                      <div className="absolute right-[-10px] top-[-10px] w-24 h-24 bg-purple-50 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
                      <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="bg-purple-50 p-3 rounded-xl text-purple-600">
                          <Users className="w-6 h-6" />
                        </div>
                      </div>
                      <div className="relative z-10">
                        <p className="text-3xl font-black text-[#ff9500]">{filteredGuests}</p>
                        <p className="text-sm font-medium text-gray-500 mt-1">Khách vãng lai</p>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Topic Chart */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                  <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-[#1992b0]" />
                      Thống kê theo lĩnh vực
                    </h2>
                  </div>
                  <div className="p-6 flex-1 min-h-[300px]">
                    {topicChartData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={topicChartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                          <XAxis type="number" />
                          <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 12 }} />
                          <RechartsTooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                          <Bar dataKey="value" fill="#1992b0" radius={[0, 4, 4, 0]} barSize={24} name="Số lượng" />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center text-gray-400">Không có dữ liệu</div>
                    )}
                  </div>
                </div>

                {/* Rating Chart */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                  <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <Star className="w-5 h-5 text-[#ff9500]" />
                      Mức độ hài lòng (Mục II)
                    </h2>
                  </div>
                  <div className="p-6 flex-1 min-h-[300px] flex flex-col sm:flex-row items-center justify-center gap-8">
                    {ratingChartData.some(d => d.value > 0) ? (
                      <>
                        <div className="w-48 h-48">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={ratingChartData.filter(d => d.value > 0)}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={2}
                                dataKey="value"
                              >
                                {ratingChartData.filter(d => d.value > 0).map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="flex flex-col gap-3">
                          {ratingChartData.map((item) => (
                            <div key={item.name} className="flex items-center gap-3 text-sm">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                              <span className="text-gray-600 w-32">{item.name}</span>
                              <span className="font-bold text-gray-900">{item.percentage}%</span>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <div className="h-full flex items-center justify-center text-gray-400 w-full">Không có dữ liệu</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Company Stats (Only for SuperAdmin) */}
              {role === 'SuperAdmin' && Object.keys(filteredFeedbacks.reduce((acc, curr) => {
                if (curr.company && curr.company !== 'Khách vãng lai') acc[curr.company] = true;
                return acc;
              }, {} as Record<string, boolean>)).length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-[#1992b0]" />
                      Thống kê theo công ty (EAP)
                    </h2>
                  </div>
                  <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(filteredFeedbacks.reduce((acc, curr) => {
                      if (curr.company && curr.company !== 'Khách vãng lai') {
                        if (!acc[curr.company]) acc[curr.company] = { count: 0, totalRating: 0 };
                        acc[curr.company].count += 1;
                        acc[curr.company].totalRating += Number(curr.q5 || 0);
                      }
                      return acc;
                    }, {} as Record<string, { count: number, totalRating: number }>)).map(([company, data]) => (
                      <div key={company} className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex items-center justify-between">
                        <div>
                          <p className="font-bold text-gray-900">{company}</p>
                          <p className="text-sm text-gray-500">{data.count} phản hồi</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-[#ff9500] font-bold bg-[#fff4e5] px-2 py-1 rounded-lg">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            {(data.totalRating / data.count).toFixed(1)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-900">Chi tiết phản hồi gần đây</h2>
              </div>

              <div className="overflow-x-auto">
                {filteredFeedbacks.length === 0 && !isLoading && !error ? (
                  <div className="p-16 text-center">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MessageSquare className="w-10 h-10 text-gray-300" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Chưa có dữ liệu</h3>
                    <p className="text-gray-500">Không tìm thấy phản hồi nào phù hợp với bộ lọc.</p>
                  </div>
                ) : (
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50/80 text-gray-500 font-bold uppercase tracking-wider text-xs">
                      <tr>
                        <th className="px-6 py-4 border-b border-gray-100">Thời gian</th>
                        {role === 'SuperAdmin' && <th className="px-6 py-4 border-b border-gray-100">Công ty</th>}
                        <th className="px-6 py-4 border-b border-gray-100">Lĩnh vực</th>
                        <th className="px-6 py-4 border-b border-gray-100">Chuyên gia</th>
                        <th className="px-6 py-4 border-b border-gray-100 text-center">Đánh giá</th>
                        <th className="px-6 py-4 border-b border-gray-100">Ý kiến khác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {filteredFeedbacks.map((fb, idx) => {
                        const rating = Number(fb.q5);
                        return (
                          <tr key={idx} className="hover:bg-gray-50/50 transition-colors group">
                            <td className="px-6 py-4 whitespace-nowrap text-gray-500 font-medium">
                              {new Date(fb.timestamp).toLocaleString('vi-VN', {
                                day: '2-digit', month: '2-digit', year: 'numeric',
                                hour: '2-digit', minute: '2-digit'
                              })}
                            </td>
                            {role === 'SuperAdmin' && (
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                                  {fb.company}
                                </span>
                              </td>
                            )}
                            <td className="px-6 py-4 font-semibold text-gray-900">{fb.topic}</td>
                            <td className="px-6 py-4 text-gray-600">{fb.expertName}</td>
                            <td className="px-6 py-4 text-center">
                              <div className="flex justify-center">
                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold text-xs ${
                                  rating >= 4 ? 'bg-green-50 text-green-700 border border-green-200' : 
                                  rating === 3 ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' : 
                                  'bg-red-50 text-red-700 border border-red-200'
                                }`}>
                                  <Star className="w-3 h-3 fill-current" />
                                  {fb.q5 || '-'}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-gray-600 max-w-xs truncate" title={fb.otherComments}>
                              {fb.otherComments ? (
                                <span className="text-gray-900">{fb.otherComments}</span>
                              ) : (
                                <span className="text-gray-400 italic">Không có</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Change Password Modal */}
      {isChangePasswordOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Đổi mật khẩu</h3>
            
            <form onSubmit={handleChangePassword} className="space-y-5">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">Mật khẩu hiện tại</label>
                <input
                  type="password"
                  required
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:bg-white focus:ring-2 focus:ring-[#1992b0] focus:border-transparent transition-all"
                  placeholder="Nhập mật khẩu hiện tại..."
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">Mật khẩu mới</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:bg-white focus:ring-2 focus:ring-[#1992b0] focus:border-transparent transition-all"
                  placeholder="Nhập mật khẩu mới..."
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">Xác nhận mật khẩu mới</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:bg-white focus:ring-2 focus:ring-[#1992b0] focus:border-transparent transition-all"
                  placeholder="Nhập lại mật khẩu mới..."
                />
              </div>
              
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsChangePasswordOpen(false)}
                  className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isChangeLoading}
                  className="flex-1 py-3 px-4 bg-[#1992b0] text-white font-bold rounded-xl hover:bg-[#157a93] transition-colors disabled:opacity-70 flex justify-center items-center gap-2"
                >
                  {isChangeLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Cập nhật
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
