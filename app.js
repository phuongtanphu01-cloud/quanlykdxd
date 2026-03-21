const API = "YOUR_API_LINK";

let data = [];

fetch(API)
.then(res => res.json())
.then(res => {
    data = res;
    render(data);
});

function render(arr){
    let html = "";

    if(arr.length === 0){
        html = "<p style='text-align:center'>Không tìm thấy dữ liệu</p>";
    }

    arr.forEach(e => {
        html += `
        <div class="card">
            <b>${e.TENHKD || ""}</b><br>
            📍 ${e.DIACHI || ""}<br>
            📞 ${e.DIENTHOAI || ""}<br>
            🏢 ${e.NNKD || ""}<br>
            🆔 ${e.MS_HKD || ""}
        </div>`;
    });

    document.getElementById("list").innerHTML = html;
}

document.getElementById("search").addEventListener("input", function(){
    let key = this.value.toLowerCase();

    let filtered = data.filter(e =>
        (e.TENHKD || "").toLowerCase().includes(key) ||
        (e.MS_HKD || "").toLowerCase().includes(key) ||
        (e.DIENTHOAI || "").includes(key)
    );

    render(filtered);
});