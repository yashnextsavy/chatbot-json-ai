// lib/companyData.js
import path from "path";
import fs from "fs";

export function loadCompanyData(companyId) {
  // Example: companyId could be "companyIT" or "companyWater"
  const filePath = path.join(process.cwd(), "public", "data", `${companyId}.json`);
  const fileContents = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(fileContents);
}
