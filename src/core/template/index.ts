// File: src/core/template/index.ts
import ejs from "ejs";
import path from "path";

const EmailTemplate = {
  employeePresence: async (employeeName: string,message : string) => {
    try {
      const html = await ejs.renderFile(path.join(__dirname, "presence.ejs"), {
        employeeName,
        message
      });
      return html;
    } catch (error) {
      console.error("Error rendering Reminder template:", error);
      return "";
    }
  },
  employeeAbsence: async (employeeName: string,message : string,date:Date) => {
    try {
      const html = await ejs.renderFile(path.join(__dirname, "absence.ejs"), {
        employeeName,
        message,
        date
      });
      return html;
    } catch (error) {
      console.error("Error rendering Reminder template:", error);
      return "";
    }
  },
  employeeSalary: async (employeeName: string,message : string) => {
    try {
      const html = await ejs.renderFile(path.join(__dirname, "salary.ejs"), {
        employeeName,
        message
      });
      return html;
    } catch (error) {
      console.error("Error rendering Reminder template:", error);
      return "";
    }
  },
  adminNotif: async (adminName: string,message: string) => {
    try {
      const html = await ejs.renderFile(path.join(__dirname, "admin.ejs"), {
        adminName,
        message
      });
      return html;
    } catch (error) {
      console.error("Error rendering Book Available template:", error);
      return "";
    }
  },
};

export default EmailTemplate;