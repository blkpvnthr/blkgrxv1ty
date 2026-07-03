export const launchWeeks = [
  {
    title: "Week 1",
    theme: "Establish the Foundation",
    objective: "Package your experience into a clear, high-income engineering narrative.",
    goals: [
      {
        title: "Finalize Resume",
        why: "Your resume is the conversion layer between your experience and interviews.",
        tasks: [
          "Update APL end date",
          "Update clearance wording",
          "Add freelance experience",
          "Rewrite summary around data systems and backend engineering",
          "Tighten bullets to preserve one-page format",
          "Export final PDF"
        ]
      },
      {
        title: "Update LinkedIn",
        why: "LinkedIn should match your resume and make your target roles obvious.",
        tasks: [
          "Update headline",
          "Rewrite About section",
          "Update APL experience",
          "Add freelance experience",
          "Feature QuantumQuant, DeepStock, and CryoET",
          "Enable Open to Work for recruiters"
        ]
      },
      {
        title: "Confirm References",
        why: "Strong references convert interviews into offers.",
        tasks: [
          "Confirm direct supervisor reference",
          "Confirm section supervisor reference",
          "Confirm group supervisor reference",
          "Save clearance-status wording",
          "Create private reference sheet"
        ]
      },
      {
        title: "Organize Portfolio",
        why: "Your projects need to look like engineered systems, not experiments.",
        tasks: [
          "Choose flagship projects",
          "Pin best GitHub repositories",
          "Improve README files",
          "Add screenshots",
          "Add architecture diagrams",
          "Refresh asmaa.dev"
        ]
      }
    ]
  },
  {
    title: "Week 2",
    theme: "Market Entry",
    objective: "Build a targeted job pipeline instead of randomly applying.",
    goals: [
      {
        title: "Build Employer List",
        why: "A target list keeps the search strategic.",
        tasks: [
          "Create application tracker",
          "Add 30–40 target employers",
          "Score companies by income, skill growth, network, and remote fit",
          "Identify top 10 priority companies",
          "Mark possible referrals"
        ]
      },
      {
        title: "Start Applying",
        why: "Applications create surface area; quality creates traction.",
        tasks: [
          "Apply to Software Engineer I roles",
          "Apply to Software Engineer II roles",
          "Apply to Backend/Data Engineer roles",
          "Submit 3–5 quality applications per weekday",
          "Save job descriptions"
        ]
      },
      {
        title: "APL Network",
        why: "Warm referrals outperform cold applications.",
        tasks: [
          "List 15–20 APL contacts",
          "Send personalized messages",
          "Ask for advice first",
          "Ask for referrals where appropriate",
          "Track outreach"
        ]
      }
    ]
  },
  {
    title: "Week 3",
    theme: "Interview Engine",
    objective: "Turn attention into offers with technical, behavioral, and project prep.",
    goals: [
      {
        title: "Technical Prep",
        why: "You need enough fluency to pass screens.",
        tasks: [
          "Complete one coding problem daily",
          "Practice SQL joins and aggregations",
          "Review Python fundamentals",
          "Review REST API design",
          "Study one system design topic daily"
        ]
      },
      {
        title: "Behavioral Stories",
        why: "Behavioral interviews decide whether people trust you on a team.",
        tasks: [
          "Prepare difficult bug story",
          "Prepare collaboration story",
          "Prepare learning story",
          "Prepare failure story",
          "Prepare proud project story"
        ]
      },
      {
        title: "Project Deep Dives",
        why: "Your projects differentiate you if you can explain architecture and tradeoffs.",
        tasks: [
          "Write QuantumQuant 60-second pitch",
          "Write QuantumQuant 5-minute deep dive",
          "Prepare scaling answer",
          "Prepare stack tradeoff answer",
          "Prepare DeepStock and CryoET pitches"
        ]
      }
    ]
  },
  {
    title: "Week 4",
    theme: "Optimization",
    objective: "Use feedback to improve the system.",
    goals: [
      {
        title: "Evaluate Feedback",
        why: "The market is giving you data.",
        tasks: [
          "Count applications",
          "Calculate response rate",
          "Separate cold vs referral responses",
          "Identify positive patterns",
          "Identify rejection patterns",
          "Write weekly retro"
        ]
      },
      {
        title: "Refine Strategy",
        why: "A good strategy changes when evidence changes.",
        tasks: [
          "Adjust resume keywords",
          "Refine target role titles",
          "Re-rank company list",
          "Prioritize high-growth roles",
          "Review location and seniority constraints"
        ]
      },
      {
        title: "Next 30-Day Cycle",
        why: "BLKGR4V1TY should operate in monthly cycles.",
        tasks: [
          "Score Career pillar",
          "Score Products pillar",
          "Score Capital pillar",
          "Score Personal Brand pillar",
          "Define next 30-day goals"
        ]
      }
    ]
  }
];

export const initialCompanies = [
  { company: "Johns Hopkins APL", role: "Software Engineer", status: "Researching", priority: "High" },
  { company: "Leidos", role: "Backend Software Engineer", status: "Researching", priority: "High" },
  { company: "Booz Allen Hamilton", role: "Data/AI Engineer", status: "Researching", priority: "High" },
  { company: "Northrop Grumman", role: "Software Engineer I/II", status: "Researching", priority: "Medium" },
  { company: "CACI", role: "Software Developer", status: "Researching", priority: "Medium" }
];

export const projects = [
  { name: "QuantumQuant", type: "Trading/Data System", status: "Active", score: 82 },
  { name: "DeepStock", type: "ML/RL System", status: "Needs README", score: 68 },
  { name: "CryoET", type: "Biomedical AI", status: "Needs Case Study", score: 64 },
  { name: "BLKGR4V1TY OS", type: "Personal Operating System", status: "Building", score: 75 }
];
