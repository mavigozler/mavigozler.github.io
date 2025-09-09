export {
	AppConfig, MChoiceResponse, Question, TestBank, Exam
};
type AppConfig = {
	routes: {
		method: "GET" | "POST";
		path: string;
		handler: string;
	}[];
	testbanks: string[]; // paths to them
};

type MChoiceResponse = "a" | "b" | "c" | "d" | "e";

type Question = {
   qtype: "mchoice" | "text" | "TF";
   category: string;  // may get more limited
   question: string;
   choices: string[];
   answer: MChoiceResponse | string | true | false;
};

type TestBank = {
   name: string;
   items: number;
   lastModified: Date;
   created: Date;
   categories: string[];
};

type Exam = {
   name: string;
   course: string;
   edterm: string;
   questionCount: number;
   lastModified: Date;
   created: Date;
   author: string;
   versions: {
      version: {
         name: "A" | "B" | "C" | "D";
         questions: Question[];
      };
   }[];
};