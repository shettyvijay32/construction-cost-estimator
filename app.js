/* =========================================================
   CONSTRUCTION COST ESTIMATOR
   VERSION 1.0
   ========================================================= */


/* ---------------------------------------------------------
   GLOBAL PROJECT DATA
   --------------------------------------------------------- */

let project = {
    name: "",
    location: "",
    client: "",
    buildingType: "",
    floors: 0,
    basements: 0,
    builtUpArea: 0,
    floorArea: 0,
    floorHeight: 0,
    buildingLength: 0,
    buildingWidth: 0
};


/* ---------------------------------------------------------
   QUANTITY DATA
   --------------------------------------------------------- */

let quantities = {
    foundationRcc: 0,
    columnRcc: 0,
    beamRcc: 0,
    slabRcc: 0,
    shearWallRcc: 0,
    staircaseRcc: 0,

    steel: 0,

    masonry: 0,
    plaster: 0,
    flooring: 0,
    painting: 0
};


/* ---------------------------------------------------------
   RATE DATA
   --------------------------------------------------------- */

let rates = {
    rcc: 8500,
    steel: 62000,
    masonry: 1200,
    plaster: 280,
    flooring: 1500,
    painting: 180,

    labour: 50000000,
    mep: 120000000,
    equipment: 20000000,
    overhead: 30000000,
    contingency: 35000000
};


/* ---------------------------------------------------------
   PAGE NAVIGATION
   --------------------------------------------------------- */

function showPage(pageId) {

    const pages = document.querySelectorAll(".page");

    pages.forEach(page => {
        page.classList.add("hidden");
    });

    const selectedPage =
        document.getElementById(pageId);

    if (selectedPage) {
        selectedPage.classList.remove("hidden");
    }

    if (pageId === "boqPage") {
        calculateCost();
    }

    if (pageId === "summaryPage") {
        calculateCost();
    }

}


/* ---------------------------------------------------------
   HELPER
   --------------------------------------------------------- */

function getNumber(id) {

    const element =
        document.getElementById(id);

    if (!element) {
        return 0;
    }

    const value =
        parseFloat(element.value);

    return isNaN(value) ? 0 : value;
}


/* ---------------------------------------------------------
   CURRENCY
   --------------------------------------------------------- */

function formatCurrency(value) {

    return new Intl.NumberFormat(
        "en-IN",
        {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0
        }
    ).format(value);

}


/* ---------------------------------------------------------
   SAVE PROJECT
   --------------------------------------------------------- */

function saveProject() {

    project.name =
        document.getElementById("projectName").value;

    project.location =
        document.getElementById("projectLocation").value;

    project.client =
        document.getElementById("clientName").value;

    project.buildingType =
        document.getElementById("buildingType").value;

    project.floors =
        getNumber("numberOfFloors");

    project.basements =
        getNumber("basements");

    project.builtUpArea =
        getNumber("builtUpArea");

    project.floorArea =
        getNumber("floorArea");

    project.floorHeight =
        getNumber("floorHeight");

    project.buildingLength =
        getNumber("buildingLength");

    project.buildingWidth =
        getNumber("buildingWidth");


    localStorage.setItem(
        "constructionProject",
        JSON.stringify(project)
    );


    updateDashboard();


    alert(
        "Project saved successfully!"
    );

}


/* ---------------------------------------------------------
   LOAD PROJECT
   --------------------------------------------------------- */

function loadProject() {

    const saved =
        localStorage.getItem(
            "constructionProject"
        );

    if (!saved) {
        return;
    }

    project = JSON.parse(saved);


    document.getElementById("projectName").value =
        project.name || "";

    document.getElementById("projectLocation").value =
        project.location || "";

    document.getElementById("clientName").value =
        project.client || "";

    document.getElementById("buildingType").value =
        project.buildingType || "Residential";

    document.getElementById("numberOfFloors").value =
        project.floors || 0;

    document.getElementById("basements").value =
        project.basements || 0;

    document.getElementById("builtUpArea").value =
        project.builtUpArea || 0;

    document.getElementById("floorArea").value =
        project.floorArea || 0;

    document.getElementById("floorHeight").value =
        project.floorHeight || 0;

    document.getElementById("buildingLength").value =
        project.buildingLength || 0;

    document.getElementById("buildingWidth").value =
        project.buildingWidth || 0;


    updateDashboard();

}


/* ---------------------------------------------------------
   UPDATE DASHBOARD
   --------------------------------------------------------- */

function updateDashboard() {

    document.getElementById(
        "dashboardProject"
    ).textContent =
        project.name || "No Project";


    document.getElementById(
        "dashboardBuilding"
    ).textContent =
        project.floors
            ? "G + " + project.floors
            : "-";


    document.getElementById(
        "dashboardArea"
    ).textContent =
        Number(project.builtUpArea || 0)
            .toLocaleString("en-IN")
        + " sq.ft";


    const total =
        calculateTotalCost();


    document.getElementById(
        "dashboardCost"
    ).textContent =
        formatCurrency(total);


    document.getElementById(
        "dashboardDetails"
    ).innerHTML = `

        <p><strong>Project:</strong>
        ${project.name || "-"}</p>

        <p><strong>Location:</strong>
        ${project.location || "-"}</p>

        <p><strong>Client:</strong>
        ${project.client || "-"}</p>

        <p><strong>Building Type:</strong>
        ${project.buildingType || "-"}</p>

        <p><strong>Floors:</strong>
        G + ${project.floors || 0}</p>

        <p><strong>Basements:</strong>
        ${project.basements || 0}</p>

    `;

}


/* ---------------------------------------------------------
   CALCULATE QUANTITIES
   --------------------------------------------------------- */

function calculateQuantities() {

    quantities.foundationRcc =
        getNumber("foundationRcc");

    quantities.columnRcc =
        getNumber("columnRcc");

    quantities.beamRcc =
        getNumber("beamRcc");

    quantities.slabRcc =
        getNumber("slabRcc");

    quantities.shearWallRcc =
        getNumber("shearWallRcc");

    quantities.staircaseRcc =
        getNumber("staircaseRcc");


    quantities.steel =
        getNumber("steelQuantity");


    quantities.masonry =
        getNumber("masonryQuantity");

    quantities.plaster =
        getNumber("plasterQuantity");

    quantities.flooring =
        getNumber("flooringQuantity");

    quantities.painting =
        getNumber("paintingQuantity");


    const totalRcc =
        quantities.foundationRcc +
        quantities.columnRcc +
        quantities.beamRcc +
        quantities.slabRcc +
        quantities.shearWallRcc +
        quantities.staircaseRcc;


    document.getElementById(
        "totalRcc"
    ).textContent =
        totalRcc.toFixed(2) + " m³";


    document.getElementById(
        "steelResult"
    ).textContent =
        quantities.steel.toFixed(2) + " MT";


    localStorage.setItem(
        "constructionQuantities",
        JSON.stringify(quantities)
    );


    calculateCost();


    alert(
        "Quantities calculated!"
    );

}


/* ---------------------------------------------------------
   LOAD QUANTITIES
   --------------------------------------------------------- */

function loadQuantities() {

    const saved =
        localStorage.getItem(
            "constructionQuantities"
        );

    if (!saved) {
        return;
    }

    quantities = JSON.parse(saved);


    document.getElementById("foundationRcc").value =
        quantities.foundationRcc;

    document.getElementById("columnRcc").value =
        quantities.columnRcc;

    document.getElementById("beamRcc").value =
        quantities.beamRcc;

    document.getElementById("slabRcc").value =
        quantities.slabRcc;

    document.getElementById("shearWallRcc").value =
        quantities.shearWallRcc;

    document.getElementById("staircaseRcc").value =
        quantities.staircaseRcc;

    document.getElementById("steelQuantity").value =
        quantities.steel;

    document.getElementById("masonryQuantity").value =
        quantities.masonry;

    document.getElementById("plasterQuantity").value =
        quantities.plaster;

    document.getElementById("flooringQuantity").value =
        quantities.flooring;

    document.getElementById("paintingQuantity").value =
        quantities.painting;


    updateQuantityDisplay();

}


/* ---------------------------------------------------------
   QUANTITY DISPLAY
   --------------------------------------------------------- */

function updateQuantityDisplay() {

    const totalRcc =
        quantities.foundationRcc +
        quantities.columnRcc +
        quantities.beamRcc +
        quantities.slabRcc +
        quantities.shearWallRcc +
        quantities.staircaseRcc;


    document.getElementById(
        "totalRcc"
    ).textContent =
        totalRcc.toFixed(2) + " m³";


    document.getElementById(
        "steelResult"
    ).textContent =
        quantities.steel.toFixed(2) + " MT";

}


/* ---------------------------------------------------------
   LOAD RATES
   --------------------------------------------------------- */

function loadRatesFromForm() {

    rates.rcc =
        getNumber("rccRate");

    rates.steel =
        getNumber("steelRate");

    rates.masonry =
        getNumber("masonryRate");

    rates.plaster =
        getNumber("plasterRate");

    rates.flooring =
        getNumber("flooringRate");

    rates.painting =
        getNumber("paintingRate");

    rates.labour =
        getNumber("labourCost");

    rates.mep =
        getNumber("mepCost");

    rates.equipment =
        getNumber("equipmentCost");

    rates.overhead =
        getNumber("overheadCost");

    rates.contingency =
        getNumber("contingencyCost");


    localStorage.setItem(
        "constructionRates",
        JSON.stringify(rates)
    );

}


/* ---------------------------------------------------------
   LOAD RATES
   --------------------------------------------------------- */

function loadRates() {

    const saved =
        localStorage.getItem(
            "constructionRates"
        );

    if (saved) {
        rates = JSON.parse(saved);
    }


    document.getElementById("rccRate").value =
        rates.rcc;

    document.getElementById("steelRate").value =
        rates.steel;

    document.getElementById("masonryRate").value =
        rates.masonry;

    document.getElementById("plasterRate").value =
        rates.plaster;

    document.getElementById("flooringRate").value =
        rates.flooring;

    document.getElementById("paintingRate").value =
        rates.painting;

    document.getElementById("labourCost").value =
        rates.labour;

    document.getElementById("mepCost").value =
        rates.mep;

    document.getElementById("equipmentCost").value =
        rates.equipment;

    document.getElementById("overheadCost").value =
        rates.overhead;

    document.getElementById("contingencyCost").value =
        rates.contingency;

}


/* ---------------------------------------------------------
   COST CALCULATION
   --------------------------------------------------------- */

function calculateTotalCost() {

    loadRatesFromForm();


    const totalRcc =
        quantities.foundationRcc +
        quantities.columnRcc +
        quantities.beamRcc +
        quantities.slabRcc +
        quantities.shearWallRcc +
        quantities.staircaseRcc;


    const rccCost =
        totalRcc * rates.rcc;


    const steelCost =
        quantities.steel * rates.steel;


    const masonryCost =
        quantities.masonry * rates.masonry;


    const plasterCost =
        quantities.plaster * rates.plaster;


    const flooringCost =
        quantities.flooring * rates.flooring;


    const paintingCost =
        quantities.painting * rates.painting;


    const civilCost =
        rccCost +
        steelCost +
        masonryCost +
        plasterCost +
        flooringCost +
        paintingCost;


    const total =
        civilCost +
        rates.labour +
        rates.mep +
        rates.equipment +
        rates.overhead +
        rates.contingency;


    return total;

}


/* ---------------------------------------------------------
   COST CALCULATION + BOQ
   --------------------------------------------------------- */

function calculateCost() {

    loadRatesFromForm();


    const totalRcc =
        quantities.foundationRcc +
        quantities.columnRcc +
        quantities.beamRcc +
        quantities.slabRcc +
        quantities.shearWallRcc +
        quantities.staircaseRcc;


    const items = [

        {
            name: "RCC",
            quantity: totalRcc,
            unit: "m³",
            rate: rates.rcc
        },

        {
            name: "Reinforcement Steel",
            quantity: quantities.steel,
            unit: "MT",
            rate: rates.steel
        },

        {
            name: "Masonry",
            quantity: quantities.masonry,
            unit: "m²",
            rate: rates.masonry
        },

        {
            name: "Plaster",
            quantity: quantities.plaster,
            unit: "m²",
            rate: rates.plaster
        },

        {
            name: "Flooring",
            quantity: quantities.flooring,
            unit: "m²",
            rate: rates.flooring
        },

        {
            name: "Painting",
            quantity: quantities.painting,
            unit: "m²",
            rate: rates.painting
        },

        {
            name: "Labour",
            quantity: 1,
            unit: "LS",
            rate: rates.labour
        },

        {
            name: "MEP",
            quantity: 1,
            unit: "LS",
            rate: rates.mep
        },

        {
            name: "Equipment",
            quantity: 1,
            unit: "LS",
            rate: rates.equipment
        },

        {
            name: "Overheads",
            quantity: 1,
            unit: "LS",
            rate: rates.overhead
        },

        {
            name: "Contingency",
            quantity: 1,
            unit: "LS",
            rate: rates.contingency
        }

    ];


    let total = 0;


    const table =
        document.getElementById(
            "boqTable"
        );


    table.innerHTML = "";


    items.forEach(item => {

        const amount =
            item.quantity * item.rate;


        total += amount;


        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>${item.name}</td>

            <td>
                ${item.quantity.toFixed(2)}
            </td>

            <td>${item.unit}</td>

            <td>
                ${formatCurrency(item.rate)}
            </td>

            <td>
                ${formatCurrency(amount)}
            </td>

        `;


        table.appendChild(row);

    });


    document.getElementById(
        "boqTotal"
    ).textContent =
        formatCurrency(total);


    document.getElementById(
        "totalProjectCost"
    ).textContent =
        formatCurrency(total);


    let costPerSqft = 0;


    if (project.builtUpArea > 0) {

        costPerSqft =
            total / project.builtUpArea;

    }


    document.getElementById(
        "costPerSqft"
    ).textContent =
        formatCurrency(costPerSqft);


    document.getElementById(
        "dashboardCost"
    ).textContent =
        formatCurrency(total);


    updateSummary(items);


    return total;

}


/* ---------------------------------------------------------
   SUMMARY
   --------------------------------------------------------- */

function updateSummary(items) {

    const container =
        document.getElementById(
            "summaryBreakdown"
        );


    container.innerHTML = "";


    items.forEach(item => {

        const amount =
            item.quantity * item.rate;


        const row =
            document.createElement("p");


        row.innerHTML = `

            <strong>
                ${item.name}
            </strong>

            :
            ${formatCurrency(amount)}

        `;


        container.appendChild(row);

    });

}


/* ---------------------------------------------------------
   EXPORT CSV
   --------------------------------------------------------- */

function exportCSV() {

    loadRatesFromForm();


    const totalRcc =
        quantities.foundationRcc +
        quantities.columnRcc +
        quantities.beamRcc +
        quantities.slabRcc +
        quantities.shearWallRcc +
        quantities.staircaseRcc;


    const rows = [

        ["Construction Cost Estimator"],

        ["Project", project.name],

        ["Location", project.location],

        ["Built-up Area", project.builtUpArea],

        [],

        [
            "Item",
            "Quantity",
            "Unit",
            "Rate",
            "Amount"
        ],

        [
            "RCC",
            totalRcc,
            "m3",
            rates.rcc,
            totalRcc * rates.rcc
        ],

        [
            "Steel",
            quantities.steel,
            "MT",
            rates.steel,
            quantities.steel * rates.steel
        ],

        [
            "Masonry",
            quantities.masonry,
            "m2",
            rates.masonry,
            quantities.masonry * rates.masonry
        ],

        [
            "Plaster",
            quantities.plaster,
            "m2",
            rates.plaster,
            quantities.plaster * rates.plaster
        ],

        [
            "Flooring",
            quantities.flooring,
            "m2",
            rates.flooring,
            quantities.flooring * rates.flooring
        ],

        [
            "Painting",
            quantities.painting,
            "m2",
            rates.painting,
            quantities.painting * rates.painting
        ],

        [
            "Labour",
            1,
            "LS",
            rates.labour,
            rates.labour
        ],

        [
            "MEP",
            1,
            "LS",
            rates.mep,
            rates.mep
        ],

        [
            "Equipment",
            1,
            "LS",
            rates.equipment,
            rates.equipment
        ],

        [
            "Overheads",
            1,
            "LS",
            rates.overhead,
            rates.overhead
        ],

        [
            "Contingency",
            1,
            "LS",
            rates.contingency,
            rates.contingency
        ]

    ];


    const csv =
        rows
            .map(row =>
                row.join(",")
            )
            .join("\n");


    const blob =
        new Blob(
            [csv],
            {
                type: "text/csv"
            }
        );


    const url =
        URL.createObjectURL(blob);


    const link =
        document.createElement("a");


    link.href = url;

    link.download =
        "construction_boq.csv";


    link.click();


    URL.revokeObjectURL(url);

}


/* ---------------------------------------------------------
   INITIALIZATION
   --------------------------------------------------------- */

window.addEventListener(
    "DOMContentLoaded",
    function () {

        loadProject();

        loadQuantities();

        loadRates();

        calculateCost();

        showPage(
            "dashboardPage"
        );

    }
);
