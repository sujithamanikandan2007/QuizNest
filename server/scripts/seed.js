const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const Result = require('../models/Result');

dotenv.config();

const sampleQuizzes = [
  {
    title: 'Java Fundamentals',
    category: 'Programming',
    difficulty: 'Medium',
    description:
      'Master core Java concepts including OOP principles, data types, threading, collections, and exception handling.',
    questions: [
      {
        question: 'Which keyword is used to inherit a class in Java?',
        options: ['this', 'extends', 'super', 'import'],
        correctAnswer: 'B',
      },
      {
        question: 'Which data type is used to create a variable that should store text in Java?',
        options: ['myString', 'string', 'Txt', 'String'],
        correctAnswer: 'D',
      },
      {
        question: 'What is the default value of a boolean instance variable in Java?',
        options: ['true', 'false', 'null', '0'],
        correctAnswer: 'B',
      },
      {
        question: 'Which method must be invoked to start the actual execution of a thread in Java?',
        options: ['run()', 'start()', 'init()', 'execute()'],
        correctAnswer: 'B',
      },
      {
        question: 'Which access specifier allows visibility within the same package and any subclasses in other packages?',
        options: ['private', 'default (package-private)', 'protected', 'public'],
        correctAnswer: 'C',
      },
      {
        question: 'Which standard Java package contains the Scanner class for parsing primitive types and strings?',
        options: ['java.lang', 'java.io', 'java.util', 'java.net'],
        correctAnswer: 'C',
      },
      {
        question: 'What is the memory size of an int primitive variable in Java?',
        options: ['16 bits', '32 bits', '64 bits', '8 bits'],
        correctAnswer: 'B',
      },
      {
        question: 'Which keyword is applied to a method to prevent it from being overridden by subclasses?',
        options: ['final', 'static', 'abstract', 'const'],
        correctAnswer: 'A',
      },
      {
        question: 'What happens when an exception is thrown in a try block that has no matching catch block, but has a finally block?',
        options: [
          'The program terminates immediately without executing the finally block',
          'The finally block executes and then the uncaught exception propagates upward',
          'An infinite loop occurs in the runtime',
          'The exception is silently discarded',
        ],
        correctAnswer: 'B',
      },
      {
        question: 'Which interface in java.lang must be implemented by a class to define its natural ordering?',
        options: ['Cloneable', 'Serializable', 'Comparable', 'Comparator'],
        correctAnswer: 'C',
      },
    ],
  },
  {
    title: 'JavaScript Basics',
    category: 'Web Development',
    difficulty: 'Easy',
    description:
      'Evaluate your knowledge of JavaScript syntax, ES6 features, scoping, closures, and the event loop.',
    questions: [
      {
        question: 'Which keyword declares a block-scoped variable that cannot be reassigned after declaration?',
        options: ['var', 'let', 'const', 'define'],
        correctAnswer: 'C',
      },
      {
        question: 'What is the output of the expression `typeof null` in standard JavaScript?',
        options: ['"null"', '"object"', '"undefined"', '"number"'],
        correctAnswer: 'B',
      },
      {
        question: 'Which static method is used to serialize a JavaScript object into a JSON string?',
        options: ['JSON.parse()', 'JSON.stringify()', 'JSON.object()', 'JSON.toText()'],
        correctAnswer: 'B',
      },
      {
        question: 'What does the strict equality operator (===) compare?',
        options: [
          'Only values after implicit coercion',
          'Only data types',
          'Both value and data type without coercion',
          'Memory address references only',
        ],
        correctAnswer: 'C',
      },
      {
        question: 'Which array method returns a new array with all elements that satisfy a given predicate function?',
        options: ['map()', 'filter()', 'reduce()', 'forEach()'],
        correctAnswer: 'B',
      },
      {
        question: 'What will `console.log(1 + "2" + 3)` evaluate to in JavaScript?',
        options: ['"6"', '"123"', '"15"', '"NaN"'],
        correctAnswer: 'B',
      },
      {
        question: 'Which of the following is NOT a JavaScript primitive data type?',
        options: ['Symbol', 'Boolean', 'BigInt', 'Object'],
        correctAnswer: 'D',
      },
      {
        question: 'What is the purpose of the `Function.prototype.bind()` method?',
        options: [
          'Executes the function immediately with arguments',
          'Creates and returns a new function with a permanently bound `this` context',
          'Merges two function signatures together',
          'Deletes the execution context of the function',
        ],
        correctAnswer: 'B',
      },
      {
        question: 'What is the primary responsibility of the JavaScript Event Loop?',
        options: [
          'Compiling JavaScript source code to WebAssembly',
          'Monitoring the Call Stack and Task Queue to schedule asynchronous callback execution',
          'Allocating heap memory for objects and arrays',
          'Performing garbage collection on unused variables',
        ],
        correctAnswer: 'B',
      },
      {
        question: 'Which method on a Promise object is specifically designed to handle rejected states?',
        options: ['.catch()', '.finally()', '.reject()', '.fallback()'],
        correctAnswer: 'A',
      },
    ],
  },
  {
    title: 'React.js Basics',
    category: 'Frontend',
    difficulty: 'Medium',
    description:
      'Test your comprehension of React components, hooks, lifecycle, Virtual DOM, and state management.',
    questions: [
      {
        question: 'Which React hook is used to declare and update local state variables in a functional component?',
        options: ['useEffect', 'useState', 'useContext', 'useReducer'],
        correctAnswer: 'B',
      },
      {
        question: 'Why should list items rendered via `.map()` have a stable and unique `key` prop?',
        options: [
          'To help React identify which items have changed, been added, or removed for efficient reconciliation',
          'To automatically style each list item with alternating background colors',
          'To attach event listeners to individual DOM elements',
          'To synchronize the list with localStorage',
        ],
        correctAnswer: 'A',
      },
      {
        question: 'What is the Virtual DOM in React?',
        options: [
          'A browser extension that optimizes webpage CSS',
          'An in-memory lightweight representation of the real DOM used to compute minimal updates',
          'A direct replacement for the native browser window document',
          'A remote backend database that stores component state',
        ],
        correctAnswer: 'B',
      },
      {
        question: 'When does a `useEffect` callback run if its dependency array is empty (`[]`)?',
        options: [
          'Before the initial DOM rendering',
          'Once after the component mounts to the screen',
          'After every single render and state update',
          'Only when the parent component updates',
        ],
        correctAnswer: 'B',
      },
      {
        question: 'What is the primary purpose of the `useMemo` hook in React?',
        options: [
          'To retain mutable values across renders without triggering a re-render',
          'To memoize the result of an expensive calculation between renders',
          'To execute side-effects after DOM mutations',
          'To create global context providers',
        ],
        correctAnswer: 'B',
      },
      {
        question: 'How is data customarily passed from a parent component down to a child component?',
        options: ['Through State', 'Through Props', 'Via Redux dispatch only', 'Via URL cookies'],
        correctAnswer: 'B',
      },
      {
        question: 'Which lifecycle phase occurs when a React component is removed from the DOM?',
        options: ['Mounting', 'Updating', 'Unmounting', 'Catching'],
        correctAnswer: 'C',
      },
      {
        question: 'In React, what characterizes a "controlled component"?',
        options: [
          'A component whose rendered HTML input value is driven directly by React component state',
          'A component restricted to administrators only',
          'A component that cannot be unmounted once rendered',
          'A component managed directly by the browser DOM without React handlers',
        ],
        correctAnswer: 'A',
      },
      {
        question: 'What does the `useRef` hook return across component renders?',
        options: [
          'A read-only tuple of state and updater function',
          'A persistent mutable object containing a `.current` property that does not trigger re-renders on change',
          'A promise resolving to the next state',
          'A memoized action dispatcher',
        ],
        correctAnswer: 'B',
      },
      {
        question: 'Why must React state never be mutated directly (e.g. `state.count = 5`)?',
        options: [
          'Direct mutations do not trigger a component re-render and can cause stale UI and desynchronization',
          'It throws a fatal syntax error in Node.js',
          'The JavaScript interpreter automatically reverts all direct mutations',
          'It automatically clears the browser session storage',
        ],
        correctAnswer: 'A',
      },
    ],
  },
  {
    title: 'DBMS Fundamentals',
    category: 'Databases',
    difficulty: 'Medium',
    description:
      'Check your understanding of relational databases, ACID properties, normalization, indexing, and SQL queries.',
    questions: [
      {
        question: 'What does the acronym ACID stand for in relational database transactions?',
        options: [
          'Atomicity, Consistency, Isolation, Durability',
          'Accuracy, Concurrency, Integrity, Dependency',
          'Access, Control, Indexing, Durability',
          'Atomicity, Concurrency, Isolation, Distribution',
        ],
        correctAnswer: 'A',
      },
      {
        question: 'Which SQL clause is used to filter aggregated data generated by a GROUP BY clause?',
        options: ['WHERE', 'HAVING', 'ORDER BY', 'FILTER BY'],
        correctAnswer: 'B',
      },
      {
        question: 'What is a Foreign Key in a relational database?',
        options: [
          'A key that uniquely identifies every tuple in its own table',
          'A column or group of columns that establishes a referential link to a primary key in another table',
          'An external security key used to decrypt database backups',
          'A temporary index generated for large query execution',
        ],
        correctAnswer: 'B',
      },
      {
        question: 'Which normal form requires the elimination of transitive dependencies on a non-prime attribute?',
        options: ['First Normal Form (1NF)', 'Second Normal Form (2NF)', 'Third Normal Form (3NF)', 'BCNF'],
        correctAnswer: 'C',
      },
      {
        question: 'Which type of SQL JOIN returns all rows from the left table and matched rows from the right table?',
        options: ['INNER JOIN', 'LEFT JOIN (LEFT OUTER JOIN)', 'RIGHT JOIN', 'CROSS JOIN'],
        correctAnswer: 'B',
      },
      {
        question: 'Which of the following SQL statements belongs to Data Definition Language (DDL)?',
        options: ['SELECT', 'UPDATE', 'CREATE TABLE', 'INSERT INTO'],
        correctAnswer: 'C',
      },
      {
        question: 'What is the primary benefit of creating an index on a frequently queried column in a database?',
        options: [
          'It enforces data encryption at rest',
          'It speeds up data retrieval operations by avoiding full table scans',
          'It automatically compresses table data by 50%',
          'It prevents duplicate rows from being inserted into any table column',
        ],
        correctAnswer: 'B',
      },
      {
        question: 'Under the ACID transaction model, what does "Durability" ensure?',
        options: [
          'Transactions execute in sequential isolation without locking',
          'Once a transaction has committed, its changes survive power loss or system crashes',
          'All database constraints are strictly checked before query execution',
          'Either all operations of the transaction commit or none do',
        ],
        correctAnswer: 'B',
      },
      {
        question: 'What is a key difference between the SQL commands TRUNCATE and DELETE?',
        options: [
          'DELETE drops the table structure while TRUNCATE preserves it',
          'TRUNCATE deletes all rows quickly by deallocating pages without row-by-row logging and cannot have a WHERE clause',
          'TRUNCATE allows filtering with a WHERE clause',
          'DELETE cannot be rolled back inside a transaction block',
        ],
        correctAnswer: 'B',
      },
      {
        question: 'What is a composite primary key in database schema design?',
        options: [
          'A primary key that includes foreign keys from three external tables',
          'A primary key composed of two or more columns to uniquely identify a record',
          'A primary key generated randomly using cryptographic hashes',
          'A temporary primary key assigned during migration',
        ],
        correctAnswer: 'B',
      },
    ],
  },
  {
    title: 'Computer Networks',
    category: 'Networking',
    difficulty: 'Hard',
    description:
      'Explore core networking concepts including the OSI model, TCP/IP, IP addressing, routing, and DNS.',
    questions: [
      {
        question: 'At which layer of the 7-layer OSI model does the Internet Protocol (IP) operate?',
        options: ['Data Link Layer', 'Network Layer (Layer 3)', 'Transport Layer (Layer 4)', 'Application Layer'],
        correctAnswer: 'B',
      },
      {
        question: 'What fundamental characteristic distinguishes TCP from UDP?',
        options: [
          'TCP is connectionless and does not guarantee delivery; UDP provides connection establishment',
          'TCP is connection-oriented and guarantees ordered, error-checked delivery; UDP is connectionless and faster',
          'TCP is only used for local area networks; UDP is used over wide area networks',
          'TCP operates at Layer 2; UDP operates at Layer 7',
        ],
        correctAnswer: 'B',
      },
      {
        question: 'What is the default standard port used for secure web traffic over HTTPS?',
        options: ['80', '21', '443', '8080'],
        correctAnswer: 'C',
      },
      {
        question: 'Which network protocol resolves human-friendly domain names (e.g. www.quiznest.com) into numerical IP addresses?',
        options: ['DHCP', 'ARP', 'DNS (Domain Name System)', 'ICMP'],
        correctAnswer: 'C',
      },
      {
        question: 'Which protocol is responsible for dynamically assigning IP addresses to client hosts joining a local network?',
        options: ['DNS', 'DHCP (Dynamic Host Configuration Protocol)', 'NAT', 'SNMP'],
        correctAnswer: 'B',
      },
      {
        question: 'What are the respective address lengths of standard IPv4 and IPv6 addresses?',
        options: ['32 bits vs 128 bits', '64 bits vs 128 bits', '16 bits vs 64 bits', '32 bits vs 64 bits'],
        correctAnswer: 'A',
      },
      {
        question: 'Which utility program relies on ICMP Echo Request and Echo Reply messages to verify host reachability?',
        options: ['traceroute', 'ping', 'netstat', 'nslookup'],
        correctAnswer: 'B',
      },
      {
        question: 'What does NAT stand for in modern router and firewall architecture?',
        options: [
          'Network Access Translation',
          'Network Address Translation',
          'Node Authentication Protocol',
          'Network Allocation Table',
        ],
        correctAnswer: 'B',
      },
      {
        question: 'At which OSI layer do conventional network routers make forwarding decisions based on destination IP?',
        options: ['Physical Layer (Layer 1)', 'Data Link Layer (Layer 2)', 'Network Layer (Layer 3)', 'Session Layer (Layer 5)'],
        correctAnswer: 'C',
      },
      {
        question: 'What sequence of packet flags constitutes the standard TCP 3-Way Handshake connection setup?',
        options: [
          'FIN -> ACK -> FIN-ACK',
          'SYN -> SYN-ACK -> ACK',
          'RST -> SYN -> ACK',
          'SYN -> PUSH -> ACK',
        ],
        correctAnswer: 'B',
      },
    ],
  },
];

async function seedDatabase() {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/quiznest';
    console.log(`Connecting to MongoDB at: ${mongoUri}`);
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected successfully for seeding.');

    // 1. Clear existing sample data
    console.log('Clearing existing collections...');
    await User.deleteMany({});
    await Quiz.deleteMany({});
    await Question.deleteMany({});
    await Result.deleteMany({});

    // 2. Create Admin user
    console.log('Creating Admin account...');
    const adminUser = await User.create({
      name: 'QuizNest Administrator',
      email: 'admin@quiznest.com',
      password: 'Admin@123',
      role: 'admin',
    });
    console.log(`Admin account created: ${adminUser.email} (Role: ${adminUser.role})`);

    // 3. Create Sample Student user
    console.log('Creating Sample Student account...');
    const studentUser = await User.create({
      name: 'Alex Johnson',
      email: 'student@quiznest.com',
      password: 'Student@123',
      role: 'student',
    });
    console.log(`Student account created: ${studentUser.email} (Role: ${studentUser.role})`);

    // 4. Seed Quizzes and their 10 Questions each
    console.log('Seeding quizzes and questions...');
    for (const quizData of sampleQuizzes) {
      const { questions, ...quizDetails } = quizData;
      const createdQuiz = await Quiz.create(quizDetails);
      console.log(`Created Quiz: "${createdQuiz.title}" (${createdQuiz.category})`);

      const questionsToInsert = questions.map((q) => ({
        quizId: createdQuiz._id,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
      }));

      await Question.insertMany(questionsToInsert);
      console.log(`  -> Inserted ${questionsToInsert.length} questions for "${createdQuiz.title}"`);
    }

    // 5. Create a sample completed attempt for the sample student so the dashboard shows real statistics immediately
    const firstQuiz = await Quiz.findOne({ title: 'JavaScript Basics' });
    if (firstQuiz) {
      const sampleQuestions = await Question.find({ quizId: firstQuiz._id });
      if (sampleQuestions.length > 0) {
        let sampleScore = 0;
        const answers = sampleQuestions.map((q, idx) => {
          // make 8 correct, 2 incorrect for realistic demo
          const isRight = idx < 8;
          const selected = isRight ? q.correctAnswer : (q.correctAnswer === 'A' ? 'B' : 'A');
          if (isRight) sampleScore++;
          return {
            questionId: q._id,
            questionText: q.question,
            options: q.options,
            selectedAnswer: selected,
            correctAnswer: q.correctAnswer,
            isCorrect: isRight,
          };
        });

        await Result.create({
          userId: studentUser._id,
          quizId: firstQuiz._id,
          score: sampleScore,
          totalQuestions: sampleQuestions.length,
          percentage: Math.round((sampleScore / sampleQuestions.length) * 100),
          answers,
          completedAt: new Date(Date.now() - 3600 * 1000 * 2), // 2 hours ago
        });
        console.log('Sample quiz attempt result created for demo student.');
      }
    }

    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

seedDatabase();
