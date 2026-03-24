const API = "https://script.google.com/macros/s/AKfycbxDXbAUrpMfe7HQChBu6frXwZgHnDs85Dnx8Cs-qv6-akXoE2Ei3rCrur0XMn8xWsSy4g/exec";

let data = [];

fetch(API)
.then(res => res.json())
.then(res => {
    data = res;
    render(data);
});

let dataHKD = [];
let dataXD = [];
let currentTab = "hkd";

fetch(API)
.then(res => res.json())
.then(res => {
    dataHKD = res.hkd;
    dataXD = res.xaydung;

    render(dataHKD);
});
function showHKD(){
    currentTab = "hkd";
    render(dataHKD);
}

function showXD(){
    currentTab = "xd";
    renderXD(dataXD);
}

function renderXD(arr){
    let html = "";

    if(arr.length === 0){
        html = "<p style='text-align:center'>Không có dữ liệu</p>";
    }

    arr.forEach(e => {
        html += `
        <div class="card">
            <b>🏗️ ${String(e.TENCONGTRINH || "")}</b><br>
            📍 ${String(e.DIACHI || "")}<br>
            📄 Số GP: ${String(e.SOGIAYPHEP || "")}<br>
            📅 Ngày cấp: ${formatDate(e.NGAYCAP)}<br>
            🆔 Mã hồ sơ: ${String(e.MA_HOSO || "")}<br>
            📝 ${String(e.GHICHU || "")}
        </div>`;
    });

    document.getElementById("list").innerHTML = html;
}

function removeVietnameseTones(str) {
  return String(str)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();
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
    keyword = removeVietnameseTones(keyword);

    let results = dataHKD.filter(e =>
        removeVietnameseTones(e.TENHKD).includes(keyword) ||
        removeVietnameseTones(e.MS_HKD).includes(keyword) ||
        removeVietnameseTones(e.DIACHI).includes(keyword)
    );

    return results.slice(0, 5);
}

function selectSuggestion(value){
    document.getElementById("search").value = value;
    document.getElementById("suggestions").innerHTML = "";

    let keyword = removeVietnameseTones(value);

    let filtered = dataHKD.filter(e =>
        removeVietnameseTones(e.TENHKD || "").includes(keyword)
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

function highlight(text, keyword){
    let t = removeVietnameseTones(text);
    let k = removeVietnameseTones(keyword);

    let index = t.indexOf(k);
    if(index === -1) return text;

    return text.substring(0, index) +
           "<mark>" + text.substring(index, index + keyword.length) + "</mark>" +
           text.substring(index + keyword.length);
}
   
document.getElementById("search").addEventListener("input", function(){
    let keyword = removeVietnameseTones(this.value);

    if(currentTab === "xd"){
        let filtered = dataXD.filter(e =>
            removeVietnameseTones(e.TENCONGTRINH || "").includes(keyword) ||
            removeVietnameseTones(e.MA_HOSO || "").includes(keyword) ||
            removeVietnameseTones(e.DIACHI || "").includes(keyword) ||
            removeVietnameseTones(e.SOGIAYPHEP || "").includes(keyword)
        );
        renderXD(filtered);
    } else {
        let filtered = dataHKD.filter(e =>
            removeVietnameseTones(e.TENHKD || "").includes(keyword) ||
            removeVietnameseTones(e.MS_HKD || "").includes(keyword) ||
            removeVietnameseTones(e.DIACHI || "").includes(keyword)
        );
        render(filtered);
    }
});
    render(filtered);
});
