import React, { useState } from "react";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

export default function App() {
  const [step, setStep] = useState(0);
  const [downloadLink, setDownloadLink] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  // ⚠️ 본인의 실제 AWS S3 버킷 정보로 변경하세요.
  const S3_BUCKET_NAME = "test-file-system-boeun";
  const AWS_REGION = "ap-northeast-2"; // 예: ap-northeast-2 (서울 리전)

  const handleFileUpload = async (file) => {
    if (!file) return;

    setStep(1); // 1단계: 업로드 중 화면 전환

    try {
      // 🚀 AWS S3 다이렉트 파일 업로드 엔드포인트 주소 구성
      // 파일명이 한글이나 공백일 경우를 대비해 encodeURIComponent 처리합니다.
      const S3_URL = `https://${S3_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${encodeURIComponent(file.name)}`;

      // S3 버킷으로 정적 바이너리 파일 직접 전송 (PUT 방식)
      const response = await fetch(S3_URL, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type || "application/octet-stream",
        },
      });

      if (!response.ok) {
        throw new Error(`S3 서버 응답 에러: ${response.status}`);
      }

      // 성공 시 S3 파일 접근 주소를 다운로드 링크로 매핑
      setDownloadLink(S3_URL);
      setStep(2); // 2단계: 완료 화면 전환
      alert("S3 버킷으로 파일 업로드 성공! 🎉");
    } catch (error) {
      console.error("S3 통신 실패:", error);
      alert(
        `AWS S3 버킷과 통신 실패!\nS3 버킷의 CORS 설정(ExposeHeaders 등) 및 퍼블릭 액세스 권한을 확인하세요.`,
      );
      setStep(0);
    }
  };

  const handleInputChange = (e) => {
    if (e.target.files.length > 0) {
      handleFileUpload(e.target.files[0]);
    }
  };

  // 드래그 앤 드롭 핸들러 (UX 편의용)
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div>
      <div>
        <div
          style={{
            backgroundColor: "#F8FAFC",
            minHeight: "100vh",
            fontFamily: "sans-serif",
            padding: "80px 20px",
          }}
        >
          <div
            style={{
              maxWidth: "450px",
              margin: "0 auto",
              background: "white",
              padding: "40px",
              borderRadius: "16px",
              boxShadow: "0 10px 15px -3px rgba(0,0,0,0.05)",
            }}
          >
            <h2
              style={{
                color: "#2563EB",
                marginBottom: "10px",
                textAlign: "center",
              }}
            >
              🌐 GlobalShare MVP Test
            </h2>
            <p
              style={{
                fontSize: "13px",
                color: "#64748B",
                marginBottom: "30px",
                textAlign: "center",
              }}
            >
              AWS S3 버킷 다이렉트 연동 테스트 (인증 없음)
            </p>

            {/* 0단계: 업로드 대기 상태 */}
            {step === 0 && (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                style={{
                  padding: "40px 20px",
                  border: isDragging
                    ? "2px dashed #1D4ED8"
                    : "2px dashed #3B82F6",
                  borderRadius: "12px",
                  backgroundColor: isDragging ? "#DBEAFE" : "#EFF6FF",
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onClick={() => document.getElementById("fileInput").click()}
              >
                <span
                  style={{
                    color: "#1D4ED8",
                    fontWeight: "600",
                    display: "block",
                    marginBottom: "5px",
                  }}
                >
                  {isDragging
                    ? "여기에 파일을 놓으세요!"
                    : "클릭하거나 파일을 드래그하세요"}
                </span>
                <span style={{ fontSize: "12px", color: "#60A5FA" }}>
                  파일 업로드 및 S3 주소 다운로드 즉시 테스트
                </span>
                <input
                  id="fileInput"
                  type="file"
                  onChange={handleInputChange}
                  style={{ display: "none" }}
                />
              </div>
            )}

            {/* 1단계: 업로드 중 상태 */}
            {step === 1 && (
              <div style={{ textAlign: "center", padding: "30px 0" }}>
                <p
                  style={{
                    fontWeight: "bold",
                    color: "#2563EB",
                    marginBottom: "10px",
                  }}
                >
                  ⏳ AWS S3 버킷으로 파일 전송 중...
                </p>
                <div style={{ fontSize: "12px", color: "#94A3B8" }}>
                  대용량 파일의 경우 네트워크 환경에 따라 수 초가 걸릴 수
                  있습니다.
                </div>
              </div>
            )}

            {/* 2단계: 업로드 완료 및 다운로드 링크 제공 상태 */}
            {step === 2 && (
              <div style={{ textAlign: "center" }}>
                <p
                  style={{
                    color: "#10B981",
                    fontWeight: "bold",
                    marginBottom: "15px",
                  }}
                >
                  ✅ 파일 업로드 성공!
                </p>

                <div
                  style={{
                    padding: "15px",
                    background: "#F1F5F9",
                    borderRadius: "8px",
                    wordBreak: "break-all",
                    marginBottom: "25px",
                    textAlign: "left",
                  }}
                >
                  <label
                    style={{
                      fontSize: "11px",
                      color: "#64748B",
                      fontWeight: "bold",
                      display: "block",
                      marginBottom: "5px",
                    }}
                  >
                    S3 다운로드 및 공유 링크:
                  </label>
                  <a
                    href={downloadLink}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      color: "#2563EB",
                      textDecoration: "underline",
                      fontSize: "13px",
                      lineHeight: "1.5",
                    }}
                  >
                    {downloadLink}
                  </a>
                </div>

                <button
                  onClick={() => setStep(0)}
                  style={{
                    padding: "12px 20px",
                    background: "#64748B",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    width: "100%",
                    fontWeight: "600",
                  }}
                >
                  새로운 파일 테스트
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div>
        <Authenticator>
          {({ signOut, user }) => (
            <main style={{ padding: "20px", fontFamily: "sans-serif" }}>
              {/* 로그인 성공 시 유저 정보에 접근 가능 */}
              <h1>안녕하세요, {user?.username}님! 👋</h1>
              <p>성공적으로 Cognito 로그인 연동이 완료되었습니다.</p>

              {/* 로그아웃 버튼 (Amplify가 제공하는 signOut 함수 호출) */}
              <button
                onClick={signOut}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#ff4d4d",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                로그아웃
              </button>
            </main>
          )}
        </Authenticator>
      </div>
    </div>
  );
}
