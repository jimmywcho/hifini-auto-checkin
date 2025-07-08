const signPageUrl = "https://hifiti.com/sg_sign.htm";

function buildHeaders(cookie) {
  return {
    Cookie: cookie,
    // 盡量模擬瀏覽器，減少被誤判機器人
    "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
    Accept: "application/json, text/plain, */*",
    "X-Requested-With": "XMLHttpRequest",
    Referer: "https://hifiti.com/",
  };
}

async function checkIn(cookie) {
  const res = await fetch(signPageUrl, {
    method: "POST",
    headers: buildHeaders(cookie),
    body: null,
  });

  const raw = await res.text();
  let json;
  try {
    json = JSON.parse(raw);
    // console.log(" ✅簽到回應：", json);
  } catch (_) {
    console.error("⚠ 無法解析回應，原始內容：", raw);
    process.exit(1);
  }

  if (json.code === '0') {
    console.log("✅ 簽到成功 " + json.message);
  } else if (json.code === 1) {
    console.log("ℹ️  " + json.message);
  } else {
    console.error("❌  簽到失敗：" + JSON.stringify(json));
    process.exit(1);
  }
}
async function main() {
  const cookie = process.env.COOKIE;
  if (!cookie) {
    console.error("❌  未找到 COOKIE 環境變量，請先設定。");
    process.exit(1);
  }

  try {
    await checkIn(cookie);
  } catch (err) {
    console.error("❌  過程中出現錯誤：", err);
    process.exit(1);
  }
}

main();