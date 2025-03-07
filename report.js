// Biến cache để lưu kết quả truy vấn cho mỗi môn (subject)
const reportCache = {};

// Lắng nghe sự kiện click vào từng mục trong dropdown
document.querySelectorAll('.dropdown-item').forEach(item => {
  item.addEventListener('click', function (e) {
    e.preventDefault();
    const subject = this.getAttribute('data-subject');
    // Cập nhật text của nút dropdown
    document.getElementById('reportDropdown').textContent = this.textContent;

    // Nếu dữ liệu của môn này đã được cache, render ngay
    if (reportCache[subject]) {
      renderReport(reportCache[subject]);
      return;
    }

// Hiển thị loading spinner với thông báo
document.getElementById('report-content').innerHTML = `
  <div class="d-flex flex-column justify-content-center align-items-center" style="height:40rem;">
    <div class="spinner-border" role="status" style="width: 4rem; height: 4rem;">
      <span class="visually-hidden">Loading...</span>
    </div>
    <h4 class="mt-3 text-muted">Vui lòng chờ trong giây lát, thông tin đang được xử lý...</h4>
  </div>
`;

    // Gọi API với endpoint và subject được chọn
    fetch(`http://127.0.0.1:8000/api/subject-reports/${subject}`)
      .then(response => response.json())
      .then(data => {
        if (data.code === 200 && data.result) {
          const r = data.result;
          // Lưu kết quả vào cache cho môn này
          reportCache[subject] = r;
          renderReport(r);
        } else {
          // Hiển thị lỗi từ backend (lấy message từ API)
          document.getElementById('report-content').innerHTML =
            `<p class="text-danger">${data.message || "Không tìm thấy dữ liệu"}</p>`;
        }
      })
      .catch(err => {
        console.error(err);
        document.getElementById('report-content').innerHTML =
          `<p class="text-danger">Có lỗi xảy ra khi gọi API.</p>`;
      });
  });
});

// Hàm render báo cáo (bảng và biểu đồ) dựa trên dữ liệu r
function renderReport(r) {
  // Tạo bảng hiển thị kết quả
  const tableHTML = `
    <h2 class="text-danger fw-bold text-center mt-2 mb-2 ms-1">Kết quả tra cứu</h2>
    <div class="table-responsive">
      <table class="table table-bordered table-striped table-sm">
        <thead class="table-dark">
          <tr>
            <th>Tổng số học sinh</th>
            <th>Số học sinh có điểm ≥ 8</th>
            <th>Số học sinh có điểm từ 6 - 8 điểm</th>
            <th>Số học sinh có điểm từ 4 - 6 điểm</th>
            <th>Số học sinh có điểm &lt; 4 điểm</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>${r.tong_so_hs || '-'}</td>
            <td>${r.diem_tren_8 || '-'}</td>
            <td>${r.diem_6_8 || '-'}</td>
            <td>${r.diem_4_6 || '-'}</td>
            <td>${r.diem_duoi_4 || '-'}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `;

  // Hiển thị: Bảng ở trên, biểu đồ bên dưới (sử dụng ApexCharts)
  document.getElementById('report-content').innerHTML = `
    <div class="row">
      <div class="col-12">
        ${tableHTML}
      </div>
    </div>
    <div class="row mt-4">
      <div class="col-12">
        <div id="myChart"></div> <!-- ApexCharts sẽ render vào đây -->
      </div>
    </div>
  `;

  // Cấu hình biểu đồ cột với ApexCharts
  const options = {
    chart: {
      type: 'bar',
      height: 500
    },
    series: [{
      name: 'Số HS',
      data: [
        r.diem_tren_8,
        r.diem_6_8,
        r.diem_4_6,
        r.diem_duoi_4
      ]
    }],
    xaxis: {
      categories: [
        '≥ 8 điểm',
        '6 - 8 điểm',
        '4 - 6 điểm',
        '< 4 điểm'
      ]
    },
    responsive: [{
      breakpoint: 768, // max-width 768px
      options: {
        chart: {
          height: 300
        }
      }
    }]
  };

  // Render biểu đồ với ApexCharts
  const chart = new ApexCharts(document.querySelector('#myChart'), options);
  chart.render();
}
