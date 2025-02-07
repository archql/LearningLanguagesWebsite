# Learning Languages Website (LLW)

## Group #4
| **Name** | **Matrikel-Nr.** |
| --- | --- |
| _Artsiom Drankevich_ | 17XXXX2 |
| _Shamsiddin Latif_ | 17XXXX7 |
| _Vladimir Zvezdkin_ | 17XXXX1 |

## Final Requirements Document

### Introduction:

Modern world has become more demanding in terms of international communication; however the language learning process is still a non-trivial task for a person. The Learning Languages Website (LLW) is a modern platform designed to make language learning accessible, easy, and effective. By combining simple gamification, personalized learning program, and user-friendly features, LLW provides a dynamic environment for users to learn at their own pace and achieve lasting results.

### Objective:

The objective of this project is to develop a user-friendly web application that facilitates effective language learning. The platform will integrate features such as gamified lessons, AI-driven adaptive learning, and adaptive lesson content. By offering an engaging, personalized, and secure learning experience, the application will make language acquisition accessible and efficient for users worldwide.

### Brief description of stakeholders:

1. User - someone who is going to actively use our system for its main purpose (language learning).
2. Customer - Holger Eichelberger.
3. Development team - group #4 (members specified above).

### Glossary:

1. Target (learning) language - human language which the user is learning.
2. Interface (UI) language - language which is used to display the website itself. Does not necessarily match with target learning language.
3. Topic - major group of lessons, usually addresses one or several related target learning language features.
4. Lesson - part of topic, addresses specific aspect of target learning language features. Has its own theoretical information associated. Has dynamically-generated exercises for practice.
5. Exercise - a dynamic task related to the lesson topic. Atomic unit of learning (you can not do “half” of exercise - you either completed it or not.

### Must (> 21 Total)

#### Technical requirements:

&nbsp;**R40:** The system **must provide** an Angular implemented frontend **to** customer.

&nbsp;**R41:** The system **must provide** a backend service architecture integrated with the

&nbsp;Angular front end **for** customer.

&nbsp;**R42:** The system **must provide** database integration for data storage **for** customer.

&nbsp;**R43:** The system **must have** test coverage greater than 60% including end-to-end tests **for** customer.

Explanation: This includes line coverage, branch coverage, and function coverage with

&nbsp;e2e tests to ensure system reliability.

**R17:** The system **must provide** Angular router-based navigation menu sections as “Dashboard,” “Lesson Selection,” “Vocabulary”, and “Profile.” **to** user.

**R6:** The system **must _is_ (be)** deployed as a runnable Virtual Machine (VM) **for** customer.

&nbsp;Explanation: The complete system should be deployable via VM including all

&nbsp;documentation.

#### User Management:

**R1:** The system **must provide** registration functionality **to** user.

**R1.1:** The system **must provide** login functionality **to** user.

**Explanation:** This allows users to securely create accounts and have personalized access to the system.

**R9:** The system **must provide** whole login session timeout functionality **to** user.

**Explanation:** Users are logged out automatically after a certain time to protect their data.

#### Learning system:

**R2:** The system **must provide** singular target learning language selection functionality **to** user.

**Explanation:** Users can personalize their learning experience by selecting a language to learn.

**R3:** The system **must provide** English and German target learning languages **to** user.

**R4:** The system **must contain** lessons grouped by topics as a list **to** user.

**Explanation:** Lessons are grouped to suit the learner’s interests.

**R5:** The system **must provide** fill-in-the-blank exercises **to** user.

**R6:** The system **must provide** multiple-choice exercises **to** user.

**R10:** The system **must provide** functionality to add unfamiliar words to a personal vocabulary list **to** user.

**Explanation:** Enables users to create a tailored list of words for further practice.

**R12:** The system **must provide** a topic completion percentage **to** user.

**R13:** The system **must provide** a lesson completion percentage **to** user.

**R14:** The system **must provide** functionality to upload a personal vocabulary list as a specialized .yaml file **to** user.

**Explanation:** Learners can import their preferred vocabulary.

**R15:** The system **must provide** functionality to download a personal vocabulary list as a specialized .yaml file **to** user.

**Explanation:** Learners can export and review their vocabulary offline.

**R16:** The system **must provide** feedback with correction of answered questions after completing each lesson in the meaningful dialog window **to** user.

**Explanation:** Immediate feedback helps users learn from mistakes instantly.

**R18:** The system **must provide** a meaningful dialog window concerning lesson quitting **to** user.

**R19:** The system **must provide** a meaningful dialog window concerning progress reset **to** user.

**Explanation:** Dialog windows prevent accidental actions and improve clarity.

**R23:** The system **must provide** ability to select any lesson from the list for studying **to** user.

**Explanation:** Learners can choose lessons based on their interests or needs.

**R24:** The system **must provide** access to theoretical information about lessons **to** user.

**Explanation:** Enables learners to study theory related to exercises.

### Should (> 6 Total)

**R8:** The system **shall contain** an FAQ section **for** user.

**Explanation:** This improves the user experience by addressing common concerns.

**R27:** The system **shall provide** UI multi-language support **to** user.

**Explanation:**  Switch the interface language (e.g., English, German, Russian) to enhance accessibility. _It is about interface language whether R2/R3 is about target learning language._

**R29:** The system **shall provide** experience points for completed lessons **to** user.

**Explanation:** Gamification motivates users by making learning more engaging.

**R30:** The system **shall provide** target learning language specific characters during exercises **to** user.

**Explanation:** Additional buttons besides textbox for input characters that are unique to the target language (e.g., German umlauts).

**R32:** The system **shall provide** a dashboard with count of completed lessons **to** user.

**R34:** The system **shall provide** search functionality to find lessons by name  **to** user.

**Explanation:** Simplifies navigation and access to specific lessons.

**R21:** The system **shall provide** full user learning progress reset feature **to** user.

**Explanation:** Allows user to start their learning fresh-new.

#### Can (> 3 Total)

**R36:** The system **can provide** cultural notes **to** user.

**Explanation:** Enhances engagement by providing cultural insights alongside language learning.

**R37:** The system **can provide** daily challenges **for** user.

**Explanation:** Encourages consistent practice.

**R38:** **If** the user's device supports the “speech-to-text” feature, the system **can provide** computer synthesized pronunciation examples **to** user.

**Explanation:** Improves listening comprehension.

**R25:** The system **shall provide** ability to ask topic-related questions from AI chatbot **to** user.

**Explanation:** The chatbot simulates conversational practice and enhances interactivity.

## Final Architecture Document

**Step 1: Review Inputs**

Design Purpose – This is a greenfield system from a mature domain. The purpose is to produce a sufficiently detailed design to support the construction of the system.

**Iteration 1: Step 2**

Iteration goal: establish an overall system structure;

Selected reference architecture: Rich Internet Application. Reasoning: Technical requirements to the system constraint our development to use this reference architecture.

Physical structure (Deployment) Three-tier deployment.

**Iteration 1: Steps 3 & 4**

Elements of the system to refine: The entire system, as this is greenfield development

**Iteration 1: Step 6**

Sketch Views and Record Design Decisions

| **Element**                | **Purpose**                                                  |
| -------------------------- | ------------------------------------------------------------ |
| AppModule                  | Main module holding all related components                   |
| Router                     | Allows routing. R7                                           |
| RegisterPageComponent      | Aggregate UI components related to registration R1           |
| LoginPageComponent         | Aggregate UI components related to login R2                  |
| LessonSelectionComponent   | Provides tree like view to select desired lesson R28         |
| VocabularyComponent        | Component which displays persona vocabulary of the user  R24 |
| DailyChallengeComponent    | **R36**                                                      |
| CulturalNoteComponent      | R35                                                          |
| LanguageSelectionComponent | R11 R12 R27                                                  |

**UML class diagram: Angular Frontend**
![](https://lh7-rt.googleusercontent.com/docsz/AD_4nXcki4iZex-rQy1aqavQv7QoDP04GygukGbsnKC6IgitxrzfOINy41pHuXQQ1ouP0lSQI3As59LImyPDi335OnJV0VuqP2Kh6SEtXpqkcQSL2lYdvVnFXObMEXijIu6vcLSHF7nu9w?key=JTs6rWGuF-AT_8MAA4nVmn6t)

**UML class diagram: Backend**![](https://lh7-rt.googleusercontent.com/docsz/AD_4nXcTAer_J-CpTQlD4PNQfaaajGAhFTOtIB7QKtKClUV_a6pSqckdw1AZnjoUojyJigmkXiF4mZUc6_HKWvePg_58ex2vb42y5AgJHpoZ9biSxcAU-2DBmmC4RXoKIZAfSMIvjRzEcg?key=JTs6rWGuF-AT_8MAA4nVmn6t)

**Database Diagram**
![](https://lh7-rt.googleusercontent.com/docsz/AD_4nXdJk-YdxdyRfYU7a9IKG80n8mGiLNuW27kFhPjwVlM6U8KnxVi18lzJzVG-ZV8v0XjPyVMrH15HygVUdT2y7ZzFGA9KAGANzU9F7aVAZlORLvWyHBXQ50yuw7t4qfDL5kSMKn7RXA?key=JTs6rWGuF-AT_8MAA4nVmn6t)

**Diagram Overview**
- The primary entities (Users, Lessons, UserProgress) are central to the system, enabling the core functionality of lesson management and progress tracking.
- The supporting entities (Vocabulary, Gamification) enhance user experience through additional custom vocabulary lists and gamified progress features.
- Relationships between tables use foreign keys to enforce data integrity and enable efficient queries.

**Authorization sequence diagram**
![](https://lh7-rt.googleusercontent.com/docsz/AD_4nXdJlAvcFCzM1ogRRW45xMdXg9pOp3JR_PY_xeGfUDUlQHz2v0IJ-p1fcAnh_4ElGLIxZrWlYIa4FjSyIwXcv3I1quPQEkCl84IVHoNzxHhYsCQ_wT2st_2yKMbL007Ki3TI0Gc3?key=JTs6rWGuF-AT_8MAA4nVmn6t)\


**Lesson sequence diagram**![](https://lh7-rt.googleusercontent.com/docsz/AD_4nXdUhYNOVVSN9dBsWGSNU21p0uayieBHCxezMdxEaQojwG0fD83r65cXZZ2bBNJWyvGRbJXM6FfXw595eM-iKT0WbQfWYlfVeLLGqAgSzNcWUmUhKFuOtpTnOPZ2k3uhggcDAx9u?key=JTs6rWGuF-AT_8MAA4nVmn6t)


**Exercise sequence diagram**![](https://lh7-rt.googleusercontent.com/docsz/AD_4nXcC1VWZU5R3VCb2LANyvV6c5CiuxBXpj8GHyNrdY5hdkqUKaVTKIvCbDtCUb5Jj-ha8xaQPVD9en7SsnQlgtsfzksJTSiZ-l_TY-Jyy38mv9v9UikCVpocRGzhErOwytc75-2VE?key=JTs6rWGuF-AT_8MAA4nVmn6t)

While working on a multiple choice or fill-in-the-blank exercise, user submits an answer, then exercise service connects with a database and validates answers. After exercise service receives validation and requests for feedback, LLM responds and return some feedback to the exerciseService, feedback is then returned to user, through exerciseComponent
