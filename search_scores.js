document.getElementById('btnSearch').addEventListener('click', function () {
    const sbd = document.getElementById('sbdInput').value.trim();

    if (!sbd) {
        alert("Vui lòng nhập số báo danh!");
        return;
    }

    fetch(`http://127.0.0.1:8000/api/exam-results/${sbd}`)
        .then(response => response.json())
        .then(data => {
            if (data.code === 200 && data.result) {
                const r = data.result;
                // Tạo bảng hiển thị kết quả
                const tableHTML = `
                    <h2 class="text-danger fw-bold text-center mb-2 ms-1">Kết quả tra cứu</h2>
                    <div class="table-responsive">
                        <table class="table table-bordered table-striped table-sm">
                            <thead class="table-dark">
                                <tr>
                                    <th>SBD</th>
                                    <th>Toán</th>
                                    <th>Ngữ văn</th>
                                    <th>Ngoại ngữ</th>
                                    <th>Vật lí</th>
                                    <th>Hóa học</th>
                                    <th>Sinh học</th>
                                    <th>Lịch sử</th>
                                    <th>Địa lí</th>
                                    <th>GDCD</th>
                                    <th>Mã ngoại ngữ</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>${r.sbd || '-'}</td>
                                    <td>${r.toan || '-'}</td>
                                    <td>${r.ngu_van || '-'}</td>
                                    <td>${r.ngoai_ngu || '-'}</td>
                                    <td>${r.vat_li || '-'}</td>
                                    <td>${r.hoa_hoc || '-'}</td>
                                    <td>${r.sinh_hoc || '-'}</td>
                                    <td>${r.lich_su || '-'}</td>
                                    <td>${r.dia_li || '-'}</td>
                                    <td>${r.gdcd || '-'}</td>
                                    <td>${r.ma_ngoai_ngu || '-'}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                `;
                document.getElementById('resultSection').innerHTML = tableHTML;
            } else {
                // Hiển thị lỗi từ backend nếu có
                document.getElementById('resultSection').innerHTML =
                    `<p class="text-danger">${data.message || "Không tìm thấy kết quả!"}</p>`;
            }
        })
        .catch(async (err) => {
            console.error(err);

            let errorMessage = "Có lỗi xảy ra khi gọi API.";

            try {
                const response = err.response;
                if (response) {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorMessage;
                }
            } catch (jsonError) {
                console.error("Lỗi khi đọc JSON từ response:", jsonError);
            }

            document.getElementById('resultSection').innerHTML =
                `<p class="text-danger">${errorMessage}</p>`;
        });
});
