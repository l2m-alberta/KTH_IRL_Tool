/**
 * KTH Innovation Readiness Level (IRL)™ Framework Data
 *
 * Authoritative source: Innovation-Readiness-Levels_IRL.pdf (KTH Innovation, CC BY-NC-SA)
 * All level summaries and detailed criteria are stored here in one editable structure
 * so framework updates can be made without modifying the UI logic.
 */

window.KTH_IRL_DATA = {
  frameworkTitle: "KTH Innovation Readiness Level™",
  attribution: "© KTH Innovation · CC BY-NC-SA · kthinnovationreadinesslevel.com",
  sampleScores: {
    CRL: 8,
    TRL: 6,
    BRL: 6,
    IPRL: 7,
    TMRL: 5,
    FRL: 9
  },
  dimensions: [
    {
      id: "CRL",
      name: "Customer Readiness Level",
      shortName: "Customer",
      acronym: "CRL",
      goal: "Confirm customer need and interest",
      version: "Version G released 2022",
      criteriaType: "bullets",
      definitionNote: null,
      levels: [
        {
          level: 1,
          summary: "Hypothesis of possible needs in the market.",
          criteria: [
            "Thinking (yourself) that a possible need/problem or opportunity might exist in a market",
            "No clear hypotheses on who customers are, what problems exist, etc. If hypotheses exist they are unclear, speculative, and there is no proof or analysis to support assumptions",
            "Limited or non-existing knowledge of the market and customers/users"
          ]
        },
        {
          level: 2,
          summary: "Identified specific needs in the market.",
          criteria: [
            "Some market research is performed, typically derived from secondary sources",
            "Brief familiarity with the market, possible customers and their problems/needs, and alternatives",
            "There is a first reasonably clear description of the problem/need hypothesis"
          ]
        },
        {
          level: 3,
          summary: "First market feedback established.",
          criteria: [
            "Received feedback from primary market research, i.e. direct contacts with e.g. a few possible users/customers or persons with industry/market knowledge (experts)",
            "A more developed understanding of possible customers and possible customer segments",
            "The problem/need hypothesis is clear and updated after customer/user/expert feedback"
          ]
        },
        {
          level: 4,
          summary: "Confirmed problem/need from several customers or users.",
          criteria: [
            "The problem/need and its importance is confirmed from multiple customers or users. Numbers are typically limited but depend on B2B/B2C and market structure (e.g. 5-10 in B2B, if market is concentrated 2-5 market leading customers, in B2C higher e.g. 10-20)",
            "Customer segmentation with initial basic customer profiles in place",
            "Identified who the user, paying customer, and decision maker is",
            "A product/service hypothesis with clear positioning against customer alternatives is defined based on customer/user feedback"
          ]
        },
        {
          level: 5,
          summary: "Established interest and relations with customers.",
          criteria: [
            "Customers/users have expressed interest for the product/service and confirmed that it can solve customers’ problems/needs (i.e. initial problem-solution fit)",
            "Established relationships with potential target customers/users providing input",
            "Decided which target customers/segments to focus on first",
            "Defined first sales pitch and value proposition adapted to target customer/segment"
          ]
        },
        {
          level: 6,
          summary: "Benefits confirmed by first customer testing.",
          criteria: [
            "Testing of product/service by customers/users has confirmed the customer value and benefits",
            "Updated sales pitch and value proposition based on customer/user feedback",
            "Defined first sales/user acquisition process and initiated structured sales activities",
            "Identified possible partners or key stakeholders relevant to reach customers/users"
          ]
        },
        {
          level: 7,
          summary: "Customers in extended testing or first test sales. Small number of active users.",
          criteria: [
            "Customer agreements in place - first sales/test sales of early versions of product/service or customers/users engaged in product/service qualifications or extended testing",
            "Small number of active users of early versions of product/service",
            "Discussions initiated with partners to reach customers/users (when relevant)"
          ]
        },
        {
          level: 8,
          summary: "First commercial sales and implemented sales process. Substantial number of active users.",
          criteria: [
            "Market ready product/service sold to customers at/near target market price",
            "Substantial number of active users of market ready product/service (initial customer traction)",
            "Sales/user acquisition process implemented with dedicated people and support systems (CRM system, etc.)",
            "Agreements in place with first partners to reach customers (when relevant)"
          ]
        },
        {
          level: 9,
          summary: "Widespread sales that scale. Large number of active users with substantial growth.",
          criteria: [
            "Widespread product deployment, sales to several customers in a repeatable and scalable way (including through partners when relevant)",
            "Large and substantially growing number of active users (significant customer traction)",
            "Company focuses on business development, customer acquisition, growth of sales, efforts to build user/customer demand, etc."
          ]
        }
      ]
    },
    {
      id: "TRL",
      name: "Technology Readiness Level",
      shortName: "Technology",
      acronym: "TRL",
      goal: "Develop and test the technology, product, service, or concept",
      version: "Version G released 2022",
      criteriaType: "bullets",
      definitionNote: "Technology = Product/service/method/system/technology/solution etc. The “thing”, or tangible realization of the idea, that you want to develop.",
      levels: [
        {
          level: 1,
          summary: "Interesting research results or initial technology idea identified.",
          criteria: [
            "Research results with potential benefits or useful applications identified.",
            "Vague idea of a technology to be developed."
          ]
        },
        {
          level: 2,
          summary: "Technology concept and/or application formulated.",
          criteria: [
            "A potential technology concept is defined and described.",
            "Practical applications can be defined/researched but are speculative, and no proof or detailed analysis that the technology will work."
          ]
        },
        {
          level: 3,
          summary: "Proof-of-concept of critical functions and/or characteristics in laboratory.",
          criteria: [
            "Tests in the laboratory environment (analytical and/or experimental) of important parameters/features/functions show that the technology concept could work and be feasible.",
            "Laboratory environment = the environment where technology is typically developed, often not the same environment as where it will be used.",
            "Active R&D is initiated to develop the technology further.",
            "There is a first idea of end-user requirements/specifications and/or use cases."
          ]
        },
        {
          level: 4,
          summary: "Technology validation in laboratory.",
          criteria: [
            "Basic components are integrated and shown to work together and produce desired results in the laboratory environment.",
            "Test results give initial evidence indicating that the technology concept will work (i.e. initial validation)."
          ]
        },
        {
          level: 5,
          summary: "Technology validation in relevant environment.",
          criteria: [
            "Basic components are integrated and tested in a more realistic form in a relevant environment",
            "Test results give evidence indicating that the technology will work (i.e. validation).",
            "Relevant environment = lab or other controlled environment that simulates the most important and most stressing aspects of the operational environment.",
            "More defined end-user requirements/specifications and/or use cases based on feedback from users."
          ]
        },
        {
          level: 6,
          summary: "Technology prototype demonstration in relevant environment.",
          criteria: [
            "Representative model or prototype of the technology has been shown to actually work in a relevant environment",
            "Representative model = a functional form of the technology, generally reduced in scale, near or at operational specification.",
            "Prototype = the technology in a form that can be used to evaluate the technical and/or manufacturing feasibility or utility of the final product.",
            "Shown to actually work (i.e. demonstration) = meet most of the important performance requirements."
          ]
        },
        {
          level: 7,
          summary: "Technology prototype demonstration in operational environment.",
          criteria: [
            "Prototype near or at the complete technology has been shown to actually work in an operational environment",
            "Operational environment = environment that addresses all the operational requirements and specifications where the technology will be used by the end-users",
            "Complete end-user requirements/specifications and/or use cases in place"
          ]
        },
        {
          level: 8,
          summary: "Technology complete and demonstrated in actual operations.",
          criteria: [
            "Complete technology has been proven to work in actual operations by first users.",
            "Complete technology = Complete - contains everything the user needs to use it; Functional - everything works the way it should for the user to solve their problem/need; Compatible - compatible with people, processes, goals, infrastructure, systems, etc. at the user; Producible - possible to produce at a reasonable cost.",
            "Proven to work = meet all performance requirements/specifications.",
            "Actual operations = implemented by end-users on their own in their day-to-day operations."
          ]
        },
        {
          level: 9,
          summary: "Technology complete and proven in actual operations over time.",
          criteria: [
            "Complete technology is scalable and proven to work in actual operations by several users over time.",
            "Continuous development, improvement, optimization of technology and production is ongoing."
          ]
        }
      ]
    },
    {
      id: "BRL",
      name: "Business Model Readiness Level",
      shortName: "Business",
      acronym: "BRL",
      goal: "Establish that the concept can be financially, environmentally, and socially viable and feasible",
      version: "Version D released 2025",
      criteriaType: "aspects",
      definitionNote: "Titled “Business Readiness Level – BRL” in the KTH IRL sheet; structured across four aspects: Business model, Market opportunity, Competition, and Sustainability.",
      levels: [
        {
          level: 1,
          summary: "No or unclear description of business idea, market potential and competition.",
          aspects: [
            { aspect: "Business model", description: "Vague/unspecified description of business idea/value proposition/business model." },
            { aspect: "Market opportunity", description: "Little insight into the market and its potential and size." },
            { aspect: "Competition", description: "Little insight into competition and/or alternative solutions." },
            { aspect: "Sustainability", description: "None or very low awareness of how sustainability aspects could affect the business idea." }
          ]
        },
        {
          level: 2,
          summary: "Description of possible business concept, market opportunity and competition. Some insight into sustainability aspects of business.",
          aspects: [
            { aspect: "Business model", description: "Business concept described in structured form, e.g. value proposition (NABC)." },
            { aspect: "Market opportunity", description: "Initial overview of markets and their potential market size." },
            { aspect: "Competition", description: "Listed some competitors and/or alternative solutions." },
            { aspect: "Sustainability", description: "Some insight into sustainability aspects of business (e.g. why and how sustainability) ." }
          ]
        },
        {
          level: 3,
          summary: "Description of business model, target market(s) and competitive landscape.",
          aspects: [
            { aspect: "Business model", description: "Draft of business model described e.g. in canvas format." },
            { aspect: "Market opportunity", description: "First description of possible target market(s) with estimates of market size (TAM, SAM)." },
            { aspect: "Competition", description: "Description of competition/competitive landscape e.g. in a matrix or positioning map." },
            { aspect: "Sustainability", description: "First description of which SDG(s) the business could target" }
          ]
        },
        {
          level: 4,
          summary: "First calculations indicate economically viable business model. First sustainability assessment of proposed business model.",
          aspects: [
            { aspect: "Business model", description: "First calculations of main costs and revenues (including pricing) show possible economic viability." },
            { aspect: "Market opportunity", description: "Well defined possible target market(s) description (TAM, SAM, SOM, value chain, geographical scope)." },
            { aspect: "Competition", description: "Suggested own positioning in competitive landscape." },
            { aspect: "Sustainability", description: "SDG assessment outlining positive and negative impact of business." }
          ]
        },
        {
          level: 5,
          summary: "Market feedback on key assumptions of business model.",
          aspects: [
            { aspect: "Business model", description: "Key assumptions of business model (specifically willingness to pay and pricing) validated by market feedback." },
            { aspect: "Market opportunity", description: "Target market description(s) updated based on market feedback (incl. own positioning in value chain)" },
            { aspect: "Competition", description: "Updated own positioning in competitive landscape based on market feedback." },
            { aspect: "Sustainability", description: "Considered how sustainability could be integrated into business to achieve positive impact." }
          ]
        },
        {
          level: 6,
          summary: "Business model validated by target customers (pilot/test sales). Key sustainability metrics proposed.",
          aspects: [
            { aspect: "Business model", description: "Business model validated by target customers in realistic business scenario (pilot, test sales, pre-order etc.)." },
            { aspect: "Market opportunity", description: "Decided on first target market (incl. geographical focus) based on relevant market input." },
            { aspect: "Competition", description: "Key market differentiators/USPs defined and added to pitch/presentation." },
            { aspect: "Sustainability", description: "Key sustainability metrics proposed (e.g. carbon footprint, social impact, circularity)." }
          ]
        },
        {
          level: 7,
          summary: "Business model validated by commercial sales.",
          aspects: [
            { aspect: "Business model", description: "Business model validated by first sales on commercial terms to several customers." },
            { aspect: "Market opportunity", description: "Target market and sales estimates validated by market feedback." },
            { aspect: "Competition", description: "Market differentiators/USPs validated by market feedback and implemented in marketing and communication." },
            { aspect: "Sustainability", description: "Sustainability metrics defined (incl. how to monitor and report)." }
          ]
        },
        {
          level: 8,
          summary: "Sales and metrics show that business model is viable. Sustainability integrated and used to create business value.",
          aspects: [
            { aspect: "Business model", description: "Sales and other metrics show that business model is viable (e.g. regarding profit, growth)" },
            { aspect: "Market opportunity", description: "Future additional target markets described including international possibilities and markets." },
            { aspect: "Competition", description: "Implemented continuous competitor monitoring." },
            { aspect: "Sustainability", description: "Sustainability is integrated into the business and used as a way to create business value and positive impact" }
          ]
        },
        {
          level: 9,
          summary: "Business model proven to meet expectations on profit, growth and sustainability.",
          aspects: [
            { aspect: "Business model", description: "Business model is operational and proven as business meets/exceeds expectations on profit, growth, scalability." },
            { aspect: "Market opportunity", description: "Actively pursuing additional target markets, internationalization strategy in place." },
            { aspect: "Competition", description: "Expanded competitor monitoring covering new markets and future scenarios." },
            { aspect: "Sustainability", description: "Operations, growth and sustainability are balanced (validated by sustainability metrics)" }
          ]
        }
      ]
    },
    {
      id: "IPRL",
      name: "IPR Readiness Level",
      shortName: "IPR",
      acronym: "IPRL",
      goal: "Clarify the legal and IP situation and secure relevant IP protection",
      version: "Version F released 2022",
      criteriaType: "bullets",
      definitionNote: "IPR = Intellectual Property Rights = Patents, trademarks, design rights, copyright, database rights, trade secrets, digital registrations (domain names, account names, etc.), company name, etc. (see examples in the tool ”IPR list”)",
      levels: [
        {
          level: 1,
          summary: "Hypothesizing on your possible IPR.",
          criteria: [
            "Hypothesizing that results or ideas might contain some possible form of IPR",
            "Some ideas on possible IPR may exist, but are speculative",
            "No description and documentation of the possible IPR",
            "Limited knowledge or unclarity regarding relevant legal aspects (ownership, use-rights etc.)",
            "Limited knowledge of uniqueness and the technical field, state-of-the art, publications etc."
          ]
        },
        {
          level: 2,
          summary: "Identified different forms of possible IPR that you have/create. Ownership is clarified and you can use relevant IPR.",
          criteria: [
            "Mapped different forms of IPR that exist or could come up during development (see IPR list)",
            "Specific ideas for IPR exist, but are not well described and defined.",
            "Agreements related to IP are identified and ownership is clarified. Inventors/creators are clarified. Knowledge of applicable IP policies, potential restrictions in contracts, etc."
          ]
        },
        {
          level: 3,
          summary: "Description of possible key IPR in some detail. Initial evaluation of potential to protect key IPR.",
          criteria: [
            "Considered what forms of IPR are key/most important and could/should be protected",
            "Sufficiently detailed description of possible IPR to evaluate possibility for protection",
            "Evaluation of protection possibilities via e.g. own searches of publications, state-of-the art solutions etc. in the field",
            "Possibly initial searches or analysis by professional of relevant prior art or conflicting IPR"
          ]
        },
        {
          level: 4,
          summary: "Confirmed that IPR protection is possible and for what. Decided why to protect certain IPR (business relevance).",
          criteria: [
            "Confirmed possibilities for protection of key IPR through searches/analysis by a professional",
            "Analyzed (ideally with professional) the key IPR and what the priorities should be for what to protect to create value for the business/project",
            "Possibly filed first IPR application/registration in some less elaborate form, e.g. own filing of trademark, “provisional” patent application (i.e. not professionally drafted), etc."
          ]
        },
        {
          level: 5,
          summary: "Draft of IPR strategy to create business value is in place. Filed first formal application/registration of key IPR.",
          criteria: [
            "Draft IPR strategy in place - first analysis and plan (preferably by professional) on how different IPR can be used to protect and be of value for the business. (see e.g. tool KTH IPR Strategy)",
            "First complete formal application/registration of key IPR filed in cooperation with professional",
            "Basic agreements in place to ascertain control of key IPR (e.g. assignments, ownership, etc.)"
          ]
        },
        {
          level: 6,
          summary: "First complete IPR strategy in place considering different IPR. Positive response on filed applications/registrations.",
          criteria: [
            "Complete IPR strategy elaborated (validated by professional) that supports business strategy",
            "Identified possible complementary/additional IPR to protect",
            "Initial assessment of freedom-to-operate with the purpose to understand the IPR landscape in the field (who is active, what key IPR) and if you could be dependent on/stopped by other IPR",
            "Positive response on applications from authorities, and analysis of response performed",
            "If no positive response: analysis performed together with professional with good prospects"
          ]
        },
        {
          level: 7,
          summary: "Filed formal applications/registrations of key IPR in relevant countries/regions according to IPR strategy.",
          criteria: [
            "Entered into national/regional phase (US, EU, JP etc.) with key IPR application/registration",
            "More complete assessment of freedom-to-operate and clear understanding of dependency on/restriction by other IPR"
          ]
        },
        {
          level: 8,
          summary: "IPR strategy and management practices fully implemented. Filed formal applications/registrations of complementary IPR.",
          criteria: [
            "IPR strategy is fully implemented. IPR is proactively used to support/protect business, IPR related agreements are professionally managed, process for securing new IPR in place",
            "Key IPR is granted in first country/region with relevant scope for business",
            "Filed complementary or additional IPR application(s)/registration(s)"
          ]
        },
        {
          level: 9,
          summary: "Strong IPR support and protection for business. IPR protection granted and maintained in relevant countries.",
          criteria: [
            "IPR strategy is proven to support and create value for business",
            "Key and complementary IPR is granted and maintained in several countries relevant for business",
            "Agreements in place to access all necessary external IPR"
          ]
        }
      ]
    },
    {
      id: "TMRL",
      name: "Team Readiness Level",
      shortName: "Team",
      acronym: "TMRL",
      goal: "Secure the right competencies and align the team",
      version: "Version E released 2022",
      criteriaType: "bullets",
      definitionNote: null,
      levels: [
        {
          level: 1,
          summary: "Lack of necessary competencies/resources to verify idea. Little insight into team needs (typically an individual).",
          criteria: [
            "Typically an individual lacking necessary competencies in key areas such as tech, business etc.",
            "Little insight into needed/necessary competencies and other needed resources (e.g. partners, service providers etc.) to verify and develop the idea"
          ]
        },
        {
          level: 2,
          summary: "Limited competencies in place to start verifying the idea. First idea of additional necessary competencies or resources.",
          criteria: [
            "Limited competencies and/or capacity present - typically 1-2 persons",
            "First idea of which additional persons/competencies that could be needed to verify/develop idea",
            "First idea of overall goal for the project"
          ]
        },
        {
          level: 3,
          summary: "Some of necessary competencies in place to verify/develop idea. Defined needed competencies (and plan for finding them).",
          criteria: [
            "One or several individuals that possess some, but not all, of necessary competencies and capacity to start verifying the idea",
            "Needs and gaps in competencies, capacity, and team diversity are identified",
            "Initial plan is defined for how to find needed prioritized competencies (near-term, <1 year)"
          ]
        },
        {
          level: 4,
          summary: "A champion is present with clear idea of direction (startup/other way). Several needed competencies in place, initiated plan to complement.",
          criteria: [
            "Team (or individual) has a clear idea of how to take the idea to market (startup, IP deal, etc.)",
            "At least one champion (driver and committed to take the idea forward) is present",
            "Several, but not all, necessary competencies are present, typically multiple individuals",
            "A plan is in place and initiated to find necessary additional competencies and capacity (described e.g. in a requirement profile), keeping in mind team diversity",
            "The team has started discussions on roles, commitment, ownership, etc. going forward"
          ]
        },
        {
          level: 5,
          summary: "Initial founding team with main needed competencies and capacity. Team agrees on ownership, roles, goals, and visions.",
          criteria: [
            "An initial founding team working together and all spending significant time. The founding team jointly having main needed competencies and capacity to start building this startup",
            "Aligned team with clarified roles, shared goals and visions, and clear commitment (e.g. time spent)",
            "The team has agreed on their respective shares (signed agreement). Ownership is balanced and incentivizing, and reflects historical and future commitment and contribution",
            "Activities to get additional competencies and capacity in progress, keeping in mind team diversity",
            "Initial systems/processes/tools in place to share knowledge and information within the team"
          ]
        },
        {
          level: 6,
          summary: "Complementary, diverse, and committed founding team with all necessary competencies and capacity to start building a business.",
          criteria: [
            "Complementary and diverse founding team in place, capable of starting to build a business",
            "All key competencies and capacity necessary for the near term are present, incl. a clear CEO",
            "Committed team where everyone feels responsibility and accountability",
            "Started recruitment of advisors and/or board members, keeping in mind board diversity",
            "Awareness of risks to team performance (conflicts, burn-out/mental health, politics, etc.)"
          ]
        },
        {
          level: 7,
          summary: "Well-functioning team and culture in place. Growth plan for expanding team and building organization over time.",
          criteria: [
            "Well-functioning team with clear roles",
            "Goals, vision, purpose, and culture are clearly articulated and documented to support team and organizational development",
            "Plan in place for how to build necessary organization and grow the team over longer term (~2 yrs)",
            "Processes/systems and plan for continuous learning and staff development implemented",
            "Board and advisors operational and supporting business and organizational development"
          ]
        },
        {
          level: 8,
          summary: "Professional organization in place (board, CEO, management, staff).",
          criteria: [
            "There is a clear leadership and management team with relevant professional experience",
            "Competent and diverse board, and relevant advisors in place and professionally used",
            "HR policies/processes/responsible in place to assure good HR practices and team diversity",
            "Necessary recruitments according to longer term plan are ongoing to ascertain relevant competencies, capacity, and diversity in the organization",
            "All levels of the organization are properly trained and motivated"
          ]
        },
        {
          level: 9,
          summary: "High performing, well-structured organization at all levels that is maintained, develops, and performs over time.",
          criteria: [
            "The organization is high performing and well-functioning (cooperation, social environment, etc.)",
            "All levels of the organization actively engaged in continuous learning and development",
            "Organizational culture, structure, processes etc. are continuously improved and developed",
            "Incentives/rewards are aligned to motivate the whole organization to reach goals and perform well",
            "The management team is maintained, developed and performs over time"
          ]
        }
      ]
    },
    {
      id: "FRL",
      name: "Funding Readiness Level",
      shortName: "Funding",
      acronym: "FRL",
      goal: "Secure the necessary funding to take the idea to the market",
      version: "Version F released 2025",
      criteriaType: "aspects",
      definitionNote: "Structured across four aspects: Funding need, Funding options, Funding status, and Funding pitch.",
      levels: [
        {
          level: 1,
          summary: "Little insight into funding needs and funding options. No funding or plan for validation of idea.",
          aspects: [
            { aspect: "Funding need", description: "Little insight into costs and relevant activities for validation of idea. Little insight into overall funding needs." },
            { aspect: "Funding options", description: "Little insight into different funding options." },
            { aspect: "Funding status", description: "No funding available or secured." },
            { aspect: "Funding pitch", description: "Initial description of idea but lacking aspects relevant for funding e.g. business concept, market potential" }
          ]
        },
        {
          level: 2,
          summary: "Identified funding needs and funding options for validation. Initiated efforts to secure funding for validation.",
          aspects: [
            { aspect: "Funding need", description: "Insight into costs and relevant activities for initial validation (e.g. 1-6 months)" },
            { aspect: "Funding options", description: "Identified funding sources for initial validation" },
            { aspect: "Funding status", description: "Initiated efforts to secure funding" },
            { aspect: "Funding pitch", description: "A description that can be used for seeking initial funding (incl. business concept e.g. NABC)" }
          ]
        },
        {
          level: 3,
          summary: "Insight into overall funding options and their requirements. Secured initial funding for validation.",
          aspects: [
            { aspect: "Funding needs", description: "Draft of costs and activities in a development/project plan (e.g. 6-12 months). Insight into overall funding needs" },
            { aspect: "Funding options", description: "Understanding of overall funding options e.g. sources and types (own, soft, equity, loans) and their requirements" },
            { aspect: "Funding status", description: "Secured sufficient funding to initiate validation, typically soft funding (grants)." },
            { aspect: "Funding pitch", description: "A first presentation for funding incl. description of key aspects relevant for funding e.g. market potential" }
          ]
        },
        {
          level: 4,
          summary: "Pitch/presentation in place for next-stage funding. Secured funding to initiate development.",
          aspects: [
            { aspect: "Funding need", description: "Defined development/project plan (e.g. 6-12 months) with cost budget, key risks, value driving milestones etc." },
            { aspect: "Funding options", description: "Identified relevant funding sources for next stages of development/project plan." },
            { aspect: "Funding status", description: "Secured sufficient funding to initiate at least first step(s) of the development/project plan." },
            { aspect: "Funding pitch", description: "Pitch/presentation for funding (oral and written) such as investor pitch deck or funding application" }
          ]
        },
        {
          level: 5,
          summary: "Pitch for funding tested on relevant audience. Possible funding roadmap and first financial projections.",
          aspects: [
            { aspect: "Funding need", description: "Funding needs over time outlined with initial financial projections (P&L, budget)" },
            { aspect: "Funding options", description: "Defined possible funding roadmap with desirable funding sources/investors and impact on cap table." },
            { aspect: "Funding status", description: "Possibly secured additional funding for next step(s) of development plan but still requiring more for next stage" },
            { aspect: "Funding pitch", description: "Pitch for funding tested on relevant audience (e.g. pitched to investor, submitted funding application)" }
          ]
        },
        {
          level: 6,
          summary: "Improved pitch for funding based on feedback. Discussions with relevant funding sources.",
          aspects: [
            { aspect: "Funding need", description: "Funding needs clarified with more detailed financial projections (incl. cash-flow)" },
            { aspect: "Funding options", description: "Funding roadmap updated based on feedback and to extend over time (e.g. seed, A-round etc)." },
            { aspect: "Funding status", description: "Discussions initiated with relevant funding sources (typically investors) on ask (how much, for what, valuation)" },
            { aspect: "Funding pitch", description: "Improved pitch/presentation for funding based on feedback from relevant audience." }
          ]
        },
        {
          level: 7,
          summary: "Term sheet level discussions with funding source(s). All material in place to pass a due diligence for funding.",
          aspects: [
            { aspect: "Funding need", description: "Basic accounting in place shows financial status. Different scenarios of funding needs outlined." },
            { aspect: "Funding options", description: "Funding roadmap includes more details on target sources over time and backup alternatives/scenarios." },
            { aspect: "Funding status", description: "Concrete discussions (term sheet level) with one or several funding sources that are clearly interested." },
            { aspect: "Funding pitch", description: "Presentation/pitch for funding also includes compiled necessary supporting material to pass due diligence." }
          ]
        },
        {
          level: 8,
          summary: "Secured funding for at least 12 months of operations. Control of financial status via financial monitoring and forecasting.",
          aspects: [
            { aspect: "Funding need", description: "Financial monitoring and accounting system enables control of financial status and forecast of funding needs." },
            { aspect: "Funding options", description: "Updated funding roadmap based on forecasts and business progress." },
            { aspect: "Funding status", description: "Secured funding for at least ca 12 months runway (funding received) or predictable recurring revenue." },
            { aspect: "Funding pitch", description: "Presentation/pitch for funding is developed to include complete business plan" }
          ]
        },
        {
          level: 9,
          summary: "Long term funding strategy in place. Prepared next needed funding with interest from funding sources.",
          aspects: [
            { aspect: "Funding need", description: "Defined next needed funding reflecting scale-up plans, company performance and financial status/forecast." },
            { aspect: "Funding options", description: "Long term funding strategy in place covering e.g. scale-up of operations." },
            { aspect: "Funding status", description: "Identified and established interest from suitable next step funding sources for longer runway." },
            { aspect: "Funding pitch", description: "Pitch/presentation, business plan and all necessary supporting material is continuously updated." }
          ]
        }
      ]
    }
  ]
};
