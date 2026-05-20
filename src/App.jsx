import React, { useState } from "react";

export default function App() {
  const [step, setStep] = useState(0);
  const [downloadLink, setDownloadLink] = useState("");

  const handleFileUpload = async (e) => {
    if (e.target.files.length === 0) return;

    setStep(1); // 1단계: 업로드 중 화면 전환

    const formData = new FormData();
    formData.append("shared_file", e.target.files[0]);

    try {
      // ⚠️ 나중에 2단계에서 만든 [내 EC2 IP 주소]로 여기를 바꾸면 됩니다!
      const response = await fetch("http://43.202.33.233/upload.php", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.status === "success") {
        setDownloadLink(data.download_url);
        setStep(2); // 2단계: 완료 화면 전환
      } else {
        alert("업로드 실패");
        setStep(0);
      }
    } catch (error) {
      console.error(error);
      alert("EC2 서버와 통신 실패! CORS나 IP 주소를 확인하세요.");
      setStep(0);
    }
  };

  // 1시간 검증용 심플 직관 UI (테일윈드 없이 작동하도록 순수 스타일링 적용)
  return (
    <div
      style={{
        padding: "50px",
        fontFamily: "sans-serif",
        textAlign: "center",
        backgroundColor: "#F8FAFC",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          maxWidth: "400px",
          margin: "0 auto",
          background: "white",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
        }}
      >
        <h2 style={{ color: "#2563EB", marginBottom: "20px" }}>
          🌐 GlobalShare MVP Test
        </h2>

        {step === 0 && (
          <div>
            <p
              style={{
                fontSize: "14px",
                color: "#64748B",
                marginBottom: "20px",
              }}
            >
              AWS EC2(PHP)와 실시간 통신을 테스트합니다.
            </p>
            <input
              type="file"
              onChange={handleFileUpload}
              style={{
                padding: "10px",
                border: "1px dashed #2563EB",
                borderRadius: "8px",
                width: "100%",
                cursor: "pointer",
              }}
            />
          </div>
        )}

        {step === 1 && (
          <div style={{ padding: "20px" }}>
            <p style={{ fontWeight: "bold", color: "#2563EB" }}>
              ⏳ AWS EC2 서버로 파일 전송 중...
            </p>
          </div>
        )}

        {step === 2 && (
          <div>
            <p style={{ color: "green", fontWeight: "bold" }}>
              ✅ 업로드 완료! (PHP 서버 응답 수신)
            </p>
            <div
              style={{
                marginTop: "15px",
                padding: "10px",
                background: "#F1F5F9",
                borderRadius: "6px",
                wordBreak: "break-all",
              }}
            >
              <a
                href={downloadLink}
                target="_blank"
                rel="noreferrer"
                style={{
                  color: "#2563EB",
                  textDecoration: "underline",
                  fontSize: "14px",
                }}
              >
                {downloadLink}
              </a>
            </div>
            <button
              onClick={() => setStep(0)}
              style={{
                marginTop: "15px",
                padding: "8px 16px",
                background: "#64748B",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              다시 하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
