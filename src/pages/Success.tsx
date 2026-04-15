import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Logo } from '../components/Logo';
import { CheckCircle, Phone, Calendar, ArrowLeft } from 'lucide-react';

export default function Success() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e8f4f7] via-[#f4f9fa] to-white py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center font-sans">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-2xl w-full bg-white/95 backdrop-blur-xl rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(25,146,176,0.2)] overflow-hidden text-center p-10 md:p-14 relative border border-white"
      >
        <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-[#1992b0] via-[#20a4c5] to-[#ff9500]"></div>
        
        <div className="flex justify-center mb-10">
          <Logo />
        </div>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mx-auto w-28 h-28 bg-gradient-to-br from-[#e8f4f7] to-[#d0ebf2] rounded-full flex items-center justify-center mb-8 shadow-inner"
        >
          <CheckCircle className="w-14 h-14 text-[#1992b0]" />
        </motion.div>

        <h1 className="text-3xl md:text-4xl font-black text-[#1992b0] mb-5 tracking-tight">
          Cảm ơn bạn đã chia sẻ!
        </h1>
        
        <p className="text-lg md:text-xl text-gray-600 mb-10 leading-relaxed font-medium">
          Những ý kiến đóng góp quý báu của bạn sẽ giúp <span className="font-bold text-[#1992b0]">SunnyCare</span> không ngừng hoàn thiện và nâng cao chất lượng dịch vụ tham vấn. Chúc bạn luôn bình an và hạnh phúc!
        </p>

        <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 mb-10 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <h3 className="text-lg font-black text-[#1992b0] mb-6 uppercase tracking-widest">ĐẶT HẸN CHO PHIÊN TIẾP THEO</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
            <a href="tel:0896397968" className="flex items-center gap-4 sm:gap-5 p-5 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-100 group hover:-translate-y-1">
              <div className="bg-[#fff4e5] p-3.5 rounded-xl group-hover:bg-[#ff9500] transition-colors duration-300 shrink-0">
                <Phone className="w-6 h-6 text-[#ff9500] group-hover:text-white transition-colors duration-300" />
              </div>
              <div className="min-w-0">
                <p className="text-sm text-gray-500 font-bold uppercase tracking-wide">Zalo</p>
                <p className="text-lg sm:text-xl font-black text-gray-900 whitespace-nowrap tracking-tight">089 639 7968</p>
              </div>
            </a>

            <a href="tel:02873006848" className="flex items-center gap-4 sm:gap-5 p-5 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-100 group hover:-translate-y-1">
              <div className="bg-[#e8f4f7] p-3.5 rounded-xl group-hover:bg-[#1992b0] transition-colors duration-300 shrink-0">
                <Phone className="w-6 h-6 text-[#1992b0] group-hover:text-white transition-colors duration-300" />
              </div>
              <div className="min-w-0">
                <p className="text-sm text-gray-500 font-bold uppercase tracking-wide">Hotline</p>
                <p className="text-lg sm:text-xl font-black text-gray-900 whitespace-nowrap tracking-tight">028 7300 6848</p>
              </div>
            </a>

            <a href="https://sunnycare.vn/dat-lich-hen" target="_blank" rel="noopener noreferrer" className="md:col-span-2 flex items-center gap-5 p-6 bg-gradient-to-r from-[#1992b0] to-[#157a93] rounded-2xl shadow-md hover:shadow-xl transition-all group hover:-translate-y-1 relative overflow-hidden">
              <div className="absolute inset-0 w-full h-full bg-white/10 group-hover:translate-x-full transition-transform duration-500 ease-out -skew-x-12 -ml-8"></div>
              <div className="bg-white/20 p-4 rounded-xl backdrop-blur-sm">
                <Calendar className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-sm text-blue-100 font-bold uppercase tracking-wide">Đặt lịch trực tuyến</p>
                <p className="text-xl md:text-2xl font-black text-white">sunnycare.vn/dat-lich-hen</p>
              </div>
            </a>
          </div>
        </div>

        <Link 
          to="/"
          className="inline-flex items-center text-[#1992b0] font-bold hover:text-[#157a93] transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Quay lại trang chủ
        </Link>
      </motion.div>
    </div>
  );
}
