document.addEventListener("DOMContentLoaded", function () {
    const apiUrl = "http://127.0.0.1:8000/api/top10-group-a";
    const mainElement = document.querySelector("main");
  
    // 1. Hiển thị spinner khi mới tải trang
    mainElement.innerHTML = `
      <div class="d-flex flex-column justify-content-center align-items-center" style="height:250px;">
        <div class="spinner-border" role="status" style="width: 4rem; height: 4rem;">
          <span class="visually-hidden">Loading...</span>
        </div>
        <h4 class="mt-3 text-muted">Đang tải dữ liệu Top 10, vui lòng chờ...</h4>
      </div>
    `;
  
    // 2. Gọi API lấy dữ liệu
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        if (data.code === 200 && Array.isArray(data.result)) {
          // 3. Render bảng Top 10
          renderTop10Table(data.result);
        } else {
          // Trường hợp code != 200 hoặc không có mảng result
          mainElement.innerHTML = `
            <p class="text-danger">Không tìm thấy dữ liệu top 10!</p>
          `;
        }
      })
      .catch(error => {
        console.error("Lỗi khi gọi API:", error);
        mainElement.innerHTML = `
          <p class="text-danger">Có lỗi xảy ra khi tải dữ liệu Top 10!</p>
        `;
      });
  });
  
  /**
   * renderTop10Table: Hàm hiển thị bảng Top 10 thí sinh
   * @param {Array} results Mảng kết quả (10 thí sinh)
   */
  function renderTop10Table(results) {
    const mainElement = document.querySelector("main");
  
    // Tạo tiêu đề và khung hiển thị
    let html = `
      <div class="mb-3 text-center">
        <h2>Top 10 thí sinh điểm cao nhất tổ hợp A00 (Toán, Lý, Hóa)</h2>
        <p class="text-muted">theo điểm thi tốt nghiệp THPT 2024</p>
      </div>
      <div class="table-responsive">
        <table class="table table-bordered table-striped">
          <thead class="table-dark">
            <tr>
              <th>SỐ BÁO DANH</th>
              <th>Toán</th>
              <th>Vật Lí</th>
              <th>Hoá học</th>
              <th>TỔNG ĐIỂM</th>
            </tr>
          </thead>
          <tbody>
    `;
  
    // Duyệt mảng kết quả để tạo các dòng trong bảng
    results.forEach(item => {
      html += `
        <tr>
          <td>${item.sbd || '-'}</td>
          <td>${item.toan || '-'}</td>
          <td>${item.vat_li || '-'}</td>
          <td>${item.hoa_hoc || '-'}</td>
          <td>${item.total_score || '-'}</td>
        </tr>
      `;
    });
  
    // Kết thúc bảng
    html += `
          </tbody>
        </table>
      </div>
    `;
  
    // Gắn nội dung vào main
    mainElement.innerHTML = html;
  }
  