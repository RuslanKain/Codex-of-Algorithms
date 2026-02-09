// Enhanced Baghdad Chapter + New Renaissance Chapter

// Enhanced Baghdad Chapter with narrative improvements
const ENHANCED_CH1 = {
  id: "ch1",
  title: "Baghdad – The City of Knowledge",
  years: "800–1100",
  scene: "The air is warm with spices, parchment, and ink. Our heroes step from a shimmering portal into 9th‑century Baghdad at its golden peak. Minarets rise; scholars debate under archways. The Codex of Algorithms lies hidden within the House of Wisdom—if history can be kept on course.",
  required: ["hindu-arabic", "algebra", "algorithm", "al-khwarizmi"],
  deck: [
    // Opening sequence - always available
    cEvent("arrival-tigris", "Arrival at the Tigris", { influence: 1 }, 0, "You emerge from the portal on a terrace overlooking Baghdad's golden domes. The air hums with scholarly debate and distant calls to prayer."),
    cEvent("location-grand-bazaar", "The Grand Bazaar", { influence: 1 }, 0, "Baghdad's bustling market — a crossroads of merchants, scholars, and secrets. Navigate its stalls to begin your quest for the Codex."),
    
    // Core required cards with enhanced narrative
    cFigure("al-khwarizmi", "Al‑Khwarizmi", { knowledge: 2 }, { knowledge: 1 }, "The Persian mathematician works tirelessly in the House of Wisdom, unknowing that his algorithms will echo through time to shape your world's survival."),
    cTech("hindu-arabic", "Hindu‑Arabic Numerals", { knowledge: 3, influence: 1 }, 2, "The revolutionary zero and place-value system. Al-Khwarizmi's treatise on Indian numerals will transform calculation forever."),
    cTech("algebra", "Algebraic Methods", { knowledge: 4 }, 2, "Al-jabr wa'l muqābala - restoration and completion. The systematic method of solving equations through symbolic manipulation."),
    cTech("algorithm", "Algorithmic Procedure", { knowledge: 4, data: 1 }, 2, "From 'Al-Khwarizmi' comes 'algorithm' - a finite sequence of unambiguous steps that will define computation itself."),
    
    // Story progression cards
    cEvent("translation-movement", "Translation Movement", { influence: 2, knowledge: 1 }, 1, "Greek, Persian, and Sanskrit texts flow into Arabic. Knowledge crosses cultures like water finding its level."),
    cEvent("paper-mills", "Paper Mills of Baghdad", { data: 2 }, 1, "Chinese papermaking technology reaches Baghdad. Knowledge can now be copied and preserved at unprecedented scale."),
    
    // Enhanced challenges with better narrative integration
    cChallenge("wisdom-keeper", "The Wisdom Keeper's Test", { knowledge: 1 }, 
      { 
        kind: "mcq", 
        question: "Al-Khwarizmi's 'al-jabr' refers to which mathematical operation?", 
        options: ["Adding terms to both sides", "Subtracting negatives", "Multiplying by constants", "Dividing fractions"], 
        answers: [0], 
        reward: { knowledge: 3 } 
      }, 
      "A learned scribe tests your understanding of the new algebraic methods."
    ),
    
    cChallenge("quiz-ch1", "Scribe's Quiz", { knowledge: 0 },
      {
        kind: "mcq",
        answers: [0],
        options: [
          "al‑jabr (restoration: adding to both sides)",
          "gradient (from calculus)",
          "data pipeline (software ops)"
        ],
        question: "In al‑Khwarizmi's algebra, what does 'al‑jabr' refer to?",
        reward: { knowledge: 3 }
      },
      "Hint: 'al‑jabr' literally means restoration (balancing)."
    ),
    
    // Historical context challenges
    cChallenge("quiz-baghdad-empire", "Capital Builders", { knowledge: 0 },
      { kind: "mcq", question: "Which empire built Baghdad as its capital?", options: ["Roman", "Abbasid", "Byzantine", "Ottoman"], answers: [1], reward: { knowledge: 2 } },
      "Navigate the Grand Bazaar by recalling who founded the city."
    ),
    
    cChallenge("tf-house-of-wisdom-1258", "Siege of 1258", { knowledge: 0 },
      { kind: "mcq", question: "True or False — The House of Wisdom was destroyed in 1258 by the Mongols.", options: ["True", "False"], answers: [0], reward: { knowledge: 2 } },
      "History turns on a siege."
    ),
    
    // Paradox tension cards
    cEvent("mongol-whispers", "Whispers from the East", { ethics: -1, influence: 1 }, 1, "Disturbing rumors reach Baghdad of horsemen beyond the Oxus. The timeline feels... different."),
    
    cChallenge("paradox-warning", "Timeline Strain", { ethics: 2 }, 
      { 
        kind: "mcq", 
        question: "To minimize paradox, you should:", 
        options: ["Change major events", "Work behind the scenes", "Reveal future knowledge", "Stop all progress"], 
        answers: [1], 
        reward: { ethics: 2, influence: 1 } 
      }, 
      "Your presence causes ripples. How do you proceed without breaking history?"
    ),
  ],
  bg: "from-amber-100 to-emerald-100",
  portrait: `url('/assets/images/house-of-wisdom-inside-background.png')`,
};

// New Renaissance Chapter 2 with mathematical foundations
const RENAISSANCE_CH2 = {
  id: "ch2", 
  title: "Renaissance – Seeds of Logic",
  years: "1200–1600",
  scene: "Florence buzzes with artistic innovation while Pisa's merchants calculate profits. In monasteries, scholars rediscover Fibonacci's Liber Abaci. But shadows gather—the Black Death's return threatens to scatter the mathematical renaissance before it can take root.",
  
  // The paradox: Black Death returns early, disrupting mathematical development
  paradox: {
    name: "The Second Mortality",
    description: "Your interference accelerates plague transmission. Mathematical schools close, manuscripts are lost.",
    threshold: 80, // Lower than Baghdad - Renaissance is more fragile
    failureText: "The plague spreads unchecked. Mathematical knowledge fragments and Europe slides into a deeper dark age."
  },
  
  required: ["fibonacci-sequence", "indo-arabic-adoption", "commercial-mathematics", "geometric-perspective"],
  
  deck: [
    // Opening - Heroes arrive in Renaissance Italy
    cEvent("arrival-florence", "Arrival in Florence", { influence: 1, knowledge: 1 }, 0, "You emerge in a bustling piazza. Brunelleschi's dome rises overhead, a testament to mathematical precision applied to architecture."),
    
    // Core mathematical developments
    cTech("fibonacci-sequence", "Fibonacci's Rabbit Problem", { knowledge: 3, data: 2 }, 3, "Leonardo of Pisa's seemingly simple rabbit breeding problem reveals a sequence where nature's patterns emerge: 1, 1, 2, 3, 5, 8, 13..."),
    
    cFigure("fibonacci", "Leonardo Fibonacci", { knowledge: 2 }, { data: 1 }, "The Pisan merchant's son who brought Hindu-Arabic numerals to Europe through his Liber Abaci. His mathematical insights will echo through centuries."),
    
    // Indian mathematical connections
    cTech("pingala-prosody", "Pingala's Prosody", { knowledge: 2, data: 1 }, 2, "Ancient Sanskrit poetry reveals binary patterns in meter - chhanda-shastra that prefigures Boolean logic by centuries."),
    
    cTech("indian-numerals", "Meru Prastāra", { knowledge: 4, data: 1 }, 3, "The Indian 'Mountain of Jewels' - what Europeans will call Pascal's Triangle, encoding combinatorial wisdom in triangular form."),
    
    // Commercial mathematics 
    cTech("commercial-mathematics", "Commercial Arithmetic", { influence: 2, knowledge: 1 }, 2, "Double-entry bookkeeping and compound interest calculations. Mathematics serves commerce and commerce serves mathematics."),
    
    cTech("geometric-perspective", "Mathematical Perspective", { knowledge: 3, compute: 1 }, 3, "Brunelleschi's linear perspective transforms art into applied mathematics. Reality can be calculated and projected."),
    
    // Renaissance polymaths
    cFigure("pacioli", "Luca Pacioli", { influence: 1 }, { knowledge: 1 }, "The 'Father of Accounting' systematizes commercial mathematics and teaches Leonardo da Vinci the divine proportion."),
    
    cEvent("printing-revolution", "Printing Revolution", { data: 3, influence: 1 }, 2, "Gutenberg's press multiplies mathematical texts. Knowledge spreads faster than any plague."),
    
    // Challenges focusing on mathematical concepts
    cChallenge("fibonacci-nature", "Golden Ratio in Nature", { knowledge: 1 }, {
      kind: "mcq",
      question: "The Fibonacci sequence appears naturally in:",
      options: ["Spiral shells", "Flower petals", "Tree branches", "All of the above"],
      answers: [3],
      reward: { knowledge: 2, data: 1 }
    }, "A botanist shows you patterns that echo Fibonacci's numbers in living forms."),
    
    cChallenge("pingala-binary", "Ancient Binary Logic", { data: 1 }, {
      kind: "drag", 
      items: ["Light syllable (0)", "Heavy syllable (1)", "Binary counting", "Boolean logic"],
      answer: ["Light syllable (0)", "Heavy syllable (1)", "Binary counting", "Boolean logic"],
      reward: { data: 2, knowledge: 1 }
    }, "Arrange how Pingala's prosody connects to future computation."),
    
    cChallenge("merchant-calculation", "Venetian Merchant's Puzzle", { influence: 1 }, {
      kind: "mcq",
      question: "If 100 florins earn 8% compound interest yearly, after 2 years you have:",
      options: ["108 florins", "116 florins", "116.64 florins", "120 florins"],
      answers: [2],
      reward: { influence: 2, knowledge: 1 }
    }, "A Venetian trader tests your grasp of compound calculations."),
    
    // Paradox elements - Black Death's return
    cEvent("plague-rumors", "Whispers of Pestilence", { ethics: -1 }, 1, "Ships from the East bring disturbing news. The Black Death stirs again, earlier than history records."),
    
    cChallenge("quarantine-mathematics", "Plague Mathematics", { ethics: 2 }, {
      kind: "mcq",
      question: "To slow plague spread while preserving learning, you:",
      options: ["Close all schools immediately", "Establish isolated study groups", "Ignore the threat", "Flee to the countryside"],
      answers: [1], 
      reward: { ethics: 2, knowledge: 1 }
    }, "Mathematical minds must survive to preserve the Renaissance flowering."),
    
    // Late-stage cards unlocked by progress
    cEvent("medici-patronage", "Medici Patronage", { influence: 3, knowledge: 1 }, 3, "The banking family's support creates new mathematical centers. Money fuels abstract thought."),
    
    cTech("perspective-machines", "Perspective Drawing Machines", { compute: 2, knowledge: 1 }, 4, "Mechanical devices to project 3D reality onto 2D surfaces. Mathematics becomes machinery."),
  ],
  
  bg: "from-amber-50 to-orange-100", 
  portrait: `url('/assets/images/renaissance-florence.png')` // Placeholder for now
};

// Enhanced narrative system components
function NarrativeManager({ chapter, paradox, progress, onTrigger }) {
  useEffect(() => {
    // Trigger narrative events based on game state
    if (chapter.id === 'ch1') {
      if (paradox >= 30 && paradox < 60) {
        onTrigger({
          title: "Temporal Disturbance",
          text: "The minaret's call wavers slightly. Some scholars glance nervously eastward, as if sensing approaching hoofbeats.",
          backdrop: `url('/assets/images/baghdad_paradox_skyline.png')`
        });
      }
    }
    
    if (chapter.id === 'ch2') {
      if (paradox >= 40) {
        onTrigger({
          title: "The Pestilence Stirs",
          text: "Black rats flee ships in unprecedented numbers. Merchants whisper of cities falling silent beyond the Alps.",
          backdrop: `url('/assets/images/renaissance-plague.png')`
        });
      }
    }
  }, [paradox, progress, chapter.id]);
  
  return null;
}

// Enhanced cutscene system for Renaissance
function RenaissanceCutscenes({ progress, onShow }) {
  useEffect(() => {
    if (progress >= 25) {
      onShow({
        title: "The Merchant's Calculation",
        text: "In a Florentine counting house, you watch merchants apply Fibonacci's methods. Each calculation strengthens the foundation of future commerce.",
        backdrop: `url('/assets/images/renaissance-counting-house.png')`
      });
    }
    
    if (progress >= 75) {
      onShow({
        title: "The Mathematical Renaissance",
        text: "Art and mathematics merge. Perspective transforms painting while algebra transforms thought. The Renaissance mathematical revolution is secure.",
        backdrop: `url('/assets/images/renaissance-davinci-workshop.png')`
      });
    }
  }, [progress]);
  
  return null;
}

export { ENHANCED_CH1, RENAISSANCE_CH2, NarrativeManager, RenaissanceCutscenes };
