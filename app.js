const API = "https://script.google.com/macros/s/AKfycbxx-TA1xYW-luPWzaM56ERvo6suTrsSUkWviuREr8AVwagroKYbvvLSU2KCBYgDcUJqXw/exec";

let dataHKD = [];
let dataXD = [];
let currentTab = "hkd";

// LOAD DATA (CHỈ 1 LẦN)
fetch(API)
.then(res => res.json())
.then(res => {
    dataHKD = res.hkd || [];
    dataXD = res.xaydung || [];

    render(dataHKD);
});

// ================= TAB =================
function showHKD(){
    currentTab = "hkd";
    document.getElementById("search").value = "";
    document.getElementById("suggestions").innerHTML = "";
    render(dataHKD);
}

function showXD(){
    currentTab = "xd";
    document.getElementById("search").value = "";
    document.getElementById("suggestions").innerHTML = "";
    renderXD(dataXD);
}

// ================= FORMAT =================
function formatDate(date){
    if(!date) return "";
    let d = new Date(date);
    if(isNaN(d)) return date;
    return d.getDate() + "/" + (d.getMonth()+1) + "/" + d.getFullYear();
}

function removeVietnameseTones(str) {
  return String(str)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();
}

// ================= RENDER =================
function render(arr){
    let html = "";

    if(arr.length === 0){
        html = "<p style='text-align:center'>Không tìm thấy dữ liệu</p>";
    }

    arr.forEach(e => {
        html += `
        <div class="card">
            <b>${String(e.TENHKD || "")}</b><br>
            📍 ${String(e.DIACHI || "")}<br><a href="https://www.google.com/maps/search/${encodeURIComponent(e.DIACHI || "")}" target="_blank">📍 Xem trên Google Maps</a><br>
            📞 ${String(e.DIENTHOAI || "")}<br>
            🏢 ${String(e.NNKD || "")}<br>
            🆔 ${String(e.MS_HKD || "")}
        </div>`;
    });

    document.getElementById("list").innerHTML = html;
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
            📍 ${String(e.DIACHI || "")}<br><a href="https://www.google.com/maps/search/${encodeURIComponent(e.DIACHI || "")}" target="_blank">📍 Xem trên Google Maps</a><br>
            📄 Số GP: ${String(e.SOGIAYPHEP || "")}<br>
            📅 Ngày cấp: ${formatDate(e.NGAYCAP)}<br>
            🆔 ${String(e.MA_HOSO || "")}<br>
            📝 ${String(e.GHICHU || "")}
        </div>`;
    });

    document.getElementById("list").innerHTML = html;
}

// ================= GỢI Ý =================
function getSuggestions(keyword){
    keyword = removeVietnameseTones(keyword);

    let source = currentTab === "xd" ? dataXD : dataHKD;

    let results = source.filter(e => {
        if(currentTab === "xd"){
            return removeVietnameseTones(e.TENCONGTRINH || "").includes(keyword) ||
                   removeVietnameseTones(e.MA_HOSO || "").includes(keyword) ||
                   removeVietnameseTones(e.DIACHI || "").includes(keyword);
        } else {
            return removeVietnameseTones(e.TENHKD || "").includes(keyword) ||
                   removeVietnameseTones(e.MS_HKD || "").includes(keyword) ||
                   removeVietnameseTones(e.DIACHI || "").includes(keyword);
        }
    });

    return results.slice(0, 5);
}

function showSuggestions(list){
    let html = "";

    list.forEach(e => {
        if(currentTab === "xd"){
            html += `
            <div onclick="selectSuggestion('${String(e.TENCONGTRINH || "")}')">
                <b>${String(e.TENCONGTRINH || "")}</b><br>
                <small>${String(e.DIACHI || "")}</small>
            </div>`;
        } else {
            html += `
            <div onclick="selectSuggestion('${String(e.TENHKD || "")}')">
                <b>${String(e.TENHKD || "")}</b><br>
                <small>${String(e.DIACHI || "")}</small>
            </div>`;
        }
    });

    document.getElementById("suggestions").innerHTML = html;
}

function selectSuggestion(value){
    document.getElementById("search").value = value;
    document.getElementById("suggestions").innerHTML = "";

    let keyword = removeVietnameseTones(value);

    if(currentTab === "xd"){
        let filtered = dataXD.filter(e =>
            removeVietnameseTones(e.TENCONGTRINH || "").includes(keyword)
        );
        renderXD(filtered);
    } else {
        let filtered = dataHKD.filter(e =>
            removeVietnameseTones(e.TENHKD || "").includes(keyword)
        );
        render(filtered);
    }
}

// ================= SEARCH =================
document.getElementById("search").addEventListener("input", function(){
    let keyword = removeVietnameseTones(this.value);

    if(this.value === ""){
        document.getElementById("suggestions").innerHTML = "";
        currentTab === "xd" ? renderXD(dataXD) : render(dataHKD);
        return;
    }

    let suggestions = getSuggestions(this.value);
    showSuggestions(suggestions);

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
