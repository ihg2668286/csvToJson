const fs = require("fs");
const csvParser = require("csv-parser");
const path = require("path");

// CSV 파일 경로 설정
const csvFilePath = path.join(__dirname, "data.csv");

// 결과를 저장할 빈 배열 정의
const results = [];

// 파일 스트림 생성 및 파싱
fs.createReadStream(csvFilePath)
  .pipe(csvParser())
  .on("data", (row) => {
    // 새 객체를 만들고 필요한 속성만 할당

    const obj = {
      id: row["Submission ID"],
      email:
        row[
          "이메일 주소 오기재시 서비스 이용에 문제가 발생할 수 있으니 이 점 유의하시어 입력해 주시길 바랍니다. "
        ],
      name: row["성함"],
      description: row["한 줄 소개글"],
      phoneNumber: row["업무 전화번호"],
      companyEmail: row["회사 이메일"],
      address: row["회사 주소지 (권장)"],
      position: row["직함"],
      companyName: row["회사명"],
      companyLogo:
        row[
          "회사 로고 이미지 (미등록 시 명함에 노출되지 않으며, 신청 여부와 관계없이 배지를 발급 받을 수 없습니다.)"
        ],
    };

    // 링크를 추출하고 'links' 배열에 저장
    obj.links = Object.keys(row)
      .filter(
        (key) =>
          key.includes(
            "디지털 명함에 넣을 개인 링크를 입력해 주세요. (최대 5개 선택)"
          ) ||
          key.startsWith("https://1") ||
          key.startsWith("https://2") ||
          key.startsWith("https://3") ||
          key.startsWith("https://4")
      )
      .map((key) => row[key])
      .filter((link) => link); // 빈 링크 제거

    // 링크가 없을 경우 빈 배열 할당
    if (obj.links.length === 0) {
      obj.links = [];
    }

    // 결과 배열에 추가
    results.push(obj);
  })
  .on("end", () => {
    // 모든 데이터가 처리된 후에 결과 출력
    // console.log(results);

    // 선택적: 결과를 JSON 파일로 저장
    fs.writeFile("output.json", JSON.stringify(results, null, 2), (err) => {
      if (err) throw err;
      console.log("JSON 파일이 생성되었습니다.");
    });
  });
