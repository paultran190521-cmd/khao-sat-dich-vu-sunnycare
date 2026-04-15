/**
 * HƯỚNG DẪN CÀI ĐẶT GOOGLE SHEETS API:
 * 1. Truy cập https://docs.google.com/spreadsheets/ và tạo một Google Sheet mới.
 * 2. Trên thanh menu, chọn "Tiện ích mở rộng" (Extensions) -> "Apps Script".
 * 3. Xóa hết code cũ và dán toàn bộ đoạn code bên dưới vào.
 * 4. Nhấn nút "Lưu" (biểu tượng đĩa mềm).
 * 5. Chọn hàm "setup" ở thanh công cụ phía trên và nhấn "Chạy" (Run) để tạo các cột tự động.
 *    (Cấp quyền truy cập nếu được yêu cầu).
 * 6. Nhấn nút "Triển khai" (Deploy) ở góc trên bên phải -> "Triển khai mới" (New deployment).
 * 7. Chọn loại triển khai là "Ứng dụng web" (Web app).
 * 8. Cấu hình:
 *    - Thực thi dưới dạng (Execute as): "Tôi" (Me).
 *    - Ai có quyền truy cập (Who has access): "Bất kỳ ai" (Anyone).
 * 9. Nhấn "Triển khai" (Deploy). Copy "URL ứng dụng web" (Web app URL).
 * 10. Quay lại ứng dụng này, dán URL đó vào phần cài đặt Admin.
 */

const SHEET_NAME = "Responses";
const ADMIN_SHEET_NAME = "Admins";

// Hàm này tự động tạo sheet và các cột cần thiết
function setup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // 1. Tạo sheet Responses
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    const headers = [
      "Timestamp", "Tên khách hàng", "Ngày tham vấn", "Chuyên gia tham vấn",
      "Lĩnh vực tham vấn", "Công ty", "Q1_Hướng dẫn", "Q2_Không gian",
      "Q3_Chi phí", "Q4_Chuyên gia", "Q5_Đánh giá chung", "Ý kiến khác",
      "Nguồn biết đến", "Sẵn sàng giới thiệu"
    ];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#1992b0").setFontColor("white");
    sheet.setFrozenRows(1);
  }
  
  // 2. Tạo sheet Admins
  let adminSheet = ss.getSheetByName(ADMIN_SHEET_NAME);
  if (!adminSheet) {
    adminSheet = ss.insertSheet(ADMIN_SHEET_NAME);
    const adminHeaders = ["Tài khoản (Tên công ty)", "Mật khẩu", "Quyền (SuperAdmin/Company)"];
    adminSheet.getRange(1, 1, 1, adminHeaders.length).setValues([adminHeaders]);
    adminSheet.getRange(1, 1, 1, adminHeaders.length).setFontWeight("bold").setBackground("#ff9500").setFontColor("white");
    adminSheet.setFrozenRows(1);
    
    // Thêm tài khoản mặc định
    adminSheet.appendRow(["SunnyCare Admin", "admin123", "SuperAdmin"]);
    adminSheet.appendRow(["Colgate", "colgate123", "Company"]);
  }
  
  return ContentService.createTextOutput("Setup complete. Các sheet đã được tạo thành công!").setMimeType(ContentService.MimeType.TEXT);
}

// Hàm nhận dữ liệu từ form (POST request)
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME);

    const row = [
      new Date(),
      data.customerName || "",
      data.consultDate || "",
      data.expertName || "",
      data.topic || "",
      data.company || "Khách vãng lai",
      data.q1 || "",
      data.q2 || "",
      data.q3 || "",
      data.q4 || "",
      data.q5 || "",
      data.otherComments || "",
      data.source || "",
      data.recommend || ""
    ];

    sheet.appendRow(row);

    return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Hàm trả về dữ liệu cho Admin (GET request)
function doGet(e) {
  if (!e || !e.parameter) {
    return ContentService.createTextOutput(JSON.stringify({ status: "ok" })).setMimeType(ContentService.MimeType.JSON);
  }

  const action = e.parameter.action;
  
  if (action === 'setup') {
    return setup();
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // Xử lý Đăng nhập
  if (action === 'login') {
    const adminSheet = ss.getSheetByName(ADMIN_SHEET_NAME);
    if (!adminSheet) {
      return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Chưa setup sheet Admins. Vui lòng chạy hàm setup()." }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    const username = e.parameter.username;
    const password = e.parameter.password;
    const rows = adminSheet.getDataRange().getValues();
    
    for (let i = 1; i < rows.length; i++) {
      if (rows[i][0] === username && rows[i][1] === password) {
        return ContentService.createTextOutput(JSON.stringify({ 
          status: "success", 
          company: rows[i][0],
          role: rows[i][2]
        })).setMimeType(ContentService.MimeType.JSON);
      }
    }
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Sai tài khoản hoặc mật khẩu" }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // Xử lý lấy dữ liệu
  const sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    return ContentService.createTextOutput(JSON.stringify({ error: "Sheet not found. Vui lòng chạy hàm setup()." }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) {
    return ContentService.createTextOutput(JSON.stringify({ feedbacks: [], stats: { total: 0, guests: 0 } }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  const headers = data[0];
  const rows = data.slice(1);

  if (action === 'getAdminData') {
    const companyFilter = e.parameter.company;
    const role = e.parameter.role;
    let filteredRows = rows;

    // Lọc theo công ty nếu không phải SuperAdmin
    if (role !== 'SuperAdmin') {
      const companyIndex = headers.indexOf("Công ty");
      filteredRows = rows.filter(row => row[companyIndex] === companyFilter);
    }

    // Map dữ liệu, BỎ QUA tên khách hàng (index 1) để bảo mật
    const result = filteredRows.map(row => {
      return {
        timestamp: row[0],
        consultDate: row[2],
        expertName: row[3],
        topic: row[4],
        company: row[5],
        q1: row[6],
        q2: row[7],
        q3: row[8],
        q4: row[9],
        q5: row[10],
        otherComments: row[11],
        source: row[12],
        recommend: row[13]
      };
    });

    // Tính toán thống kê
    const totalResponses = filteredRows.length;
    const companyIndex = headers.indexOf("Công ty");
    const guestCount = filteredRows.filter(row => row[companyIndex] === "Khách vãng lai").length;

    return ContentService.createTextOutput(JSON.stringify({
      feedbacks: result,
      stats: {
        total: totalResponses,
        guests: guestCount
      }
    })).setMimeType(ContentService.MimeType.JSON);
  }

  return ContentService.createTextOutput(JSON.stringify({ status: "ok" })).setMimeType(ContentService.MimeType.JSON);
}
