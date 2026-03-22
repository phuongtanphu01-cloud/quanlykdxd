const API = "https://script.google.com/macros/s/AKfycbxDXbAUrpMfe7HQChBu6frXwZgHnDs85Dnx8Cs-qv6-akXoE2Ei3rCrur0XMn8xWsSy4g/exec";

let data = [];

fetch(API)
.then(res => res.json())
.then(res => {
    data = res;
    render(data);
});

function removeVietnameseTones(str) {
  return str.normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}

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

function getSuggestions(keyword){
    keyword = keyword.toLowerCase();

    let results = data.filter(e =>
        removeVietnameseTones(String(e.TENHKD || "").toLowerCase()).includes(keyword) ||
        removeVietnameseTones(String(e.MA_HKD || "").toLowerCase()).includes(keyword) ||
        removeVietnameseTones(String(e.DIACHI || "").toLowerCase()).includes(keyword)
    );

    return results.slice(0, 5); // chỉ lấy 5 gợi ý
}

function selectSuggestion(value){
    document.getElementById("search").value = value;
    document.getElementById("suggestions").innerHTML = "";

    let filtered = data.filter(e =>
        removeVietnameseTones(String(e.TENHKD || "").toLowerCase()).includes(value.toLowerCase())
    );

    render(filtered);
}
function showSuggestions(list){
    let html = "";

    list.forEach(e => {
        html += `
        <div onclick="selectSuggestion('${String(e.TENHKD || "")}')">
            <b>${String(e.TENHKD || "")}</b><br>
            <small>${String(e.DIACHI || "")}</small>
        </div>`;
    });

    document.getElementById("suggestions").innerHTML = html;
}
document.getElementById("search").addEventListener("input", function(){
    let key = this.value.toLowerCase();

    if(key.length === 0){
        document.getElementById("suggestions").innerHTML = "";
        render(data);
        return;
    }

    let suggestions = getSuggestions(key);
    showSuggestions(suggestions);

    let filtered = data.filter(e =>
        removeVietnameseTones(String(e.TENHKD || "").toLowerCase()).includes(key) ||
        removeVietnameseTones(String(e.MA_HKD || "").toLowerCase()).includes(key) ||
        removeVietnameseTones(String(e.DIACHI || "").toLowerCase()).includes(key)
    );

    render(filtered);
});
