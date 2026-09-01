/* =========================================================
   CONSTRUCTION COST ESTIMATOR
   VERSION 2.0

   Changes:
   - Proper Unicode support
   - Real XLSX Excel export
   - m³ and m² correctly preserved
   - Total Amount exported
   - Excel formatting
   - Proper column alignment
   - BOQ rows
========================================================= */


/* =========================================================
   PROJECT DATA
========================================================= */

let project = {
    name: "",
    location: "",
    client: "",
    buildingType: "Residential",
    floors: 0,
    basements: 0,
    builtUpArea: 0,
    floorArea: 0,
    floorHeight: 0,
    buildingLength: 0,
    buildingWidth: 0
};



/* =========================================================
   QUANTITY DATA
========================================================= */

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



/* =========================================================
   RATE DATA
========================================================= */

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



/* =========================================================
   BOQ DATA
========================================================= */

let boqRows = [

    {
        id: 1,
        sno: "1",
        description: "Earth Work",
        l: 0,
        b: 0,
        dt: 0,
        quantity: 0,
        unit: "m³",
        rate: 0
    },

    {
        id: 2,
        sno: "2",
        description: "Footing Concrete",
        l: 0,
        b: 0,
        dt: 0,
        quantity: 0,
        unit: "m³",
        rate: 0
    },

    {
        id: 3,
        sno: "3",
        description: "Columns",
        l: 0,
        b: 0,
        dt: 0,
        quantity: 0,
        unit: "m³",
        rate: 0
    },

    {
        id: 4,
        sno: "4",
        description: "Slab",
        l: 0,
        b: 0,
        dt: 0,
        quantity: 0,
        unit: "m³",
        rate: 0
    },

    {
        id: 5,
        sno: "5",
        description: "Brick Work",
        l: 0,
        b: 0,
        dt: 0,
        quantity: 0,
        unit: "m²",
        rate: 0
    },

    {
        id: 6,
        sno: "6",
        description: "Plastering",
        l: 0,
        b: 0,
        dt: 0,
        quantity: 0,
        unit: "m²",
        rate: 0
    },

    {
        id: 7,
        sno: "7",
        description: "Putty",
        l: 0,
        b: 0,
        dt: 0,
        quantity: 0,
        unit: "m²",
        rate: 0
    },

    {
        id: 8,
        sno: "8",
        description: "Painting 1st Coat",
        l: 0,
        b: 0,
        dt: 0,
        quantity: 0,
        unit: "m²",
        rate: 0
    },

    {
        id: 9,
        sno: "9",
        description: "Dado",
        l: 0,
        b: 0,
        dt: 0,
        quantity: 0,
        unit: "m²",
        rate: 0
    }
];



let nextBoqId = 10;



/* =========================================================
   PAGE NAVIGATION
========================================================= */

function showPage(pageId) {

    const pages =
        document.querySelectorAll(".page");


    pages.forEach(page => {

        page.classList.add("hidden");

    });


    const selectedPage =
        document.getElementById(pageId);


    if (selectedPage) {

        selectedPage.classList.remove("hidden");

    }


    if (
        pageId === "boqPage" ||
        pageId === "summaryPage"
    ) {

        calculateCost();

    }

}



/* =========================================================
   NUMBER HELPER
========================================================= */

function getNumber(id) {

    const element =
        document.getElementById(id);


    if (!element) {

        return 0;

    }


    const value =
        parseFloat(element.value);


    return Number.isFinite(value)
        ? value
        : 0;
}



/* =========================================================
   CURRENCY
========================================================= */

function formatCurrency(value) {

    return new Intl.NumberFormat(
        "en-IN",
        {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0
        }
    ).format(Number(value) || 0);

}



/* =========================================================
   SAVE PROJECT
========================================================= */

function saveProject() {

    project.name =
        document.getElementById(
            "projectName"
        ).value;


    project.location =
        document.getElementById(
            "projectLocation"
        ).value;


    project.client =
        document.getElementById(
            "clientName"
        ).value;


    project.buildingType =
        document.getElementById(
            "buildingType"
        ).value;


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



/* =========================================================
   LOAD PROJECT
========================================================= */

function loadProject() {

    const saved =
        localStorage.getItem(
            "constructionProject"
        );


    if (!saved) {

        return;

    }


    try {

        project =
            JSON.parse(saved);

    } catch (error) {

        console.error(
            "Unable to load project:",
            error
        );

        return;

    }


    const fields = {

        projectName: project.name || "",

        projectLocation:
            project.location || "",

        clientName:
            project.client || "",

        buildingType:
            project.buildingType ||
            "Residential",

        numberOfFloors:
            project.floors || 0,

        basements:
            project.basements || 0,

        builtUpArea:
            project.builtUpArea || 0,

        floorArea:
            project.floorArea || 0,

        floorHeight:
            project.floorHeight || 0,

        buildingLength:
            project.buildingLength || 0,

        buildingWidth:
            project.buildingWidth || 0
    };


    Object.keys(fields).forEach(id => {

        const element =
            document.getElementById(id);


        if (element) {

            element.value =
                fields[id];

        }

    });


    updateDashboard();

}



/* =========================================================
   DASHBOARD
========================================================= */

function updateDashboard() {

    document.getElementById(
        "dashboardProject"
    ).textContent =
        project.name ||
        "No Project";


    document.getElementById(
        "dashboardBuilding"
    ).textContent =
        project.floors
            ? "G + " + project.floors
            : "-";


    document.getElementById(
        "dashboardArea"
    ).textContent =
        Number(
            project.builtUpArea || 0
        ).toLocaleString("en-IN")
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

        <p>
            <strong>Project:</strong>
            ${escapeHtml(project.name || "-")}
        </p>

        <p>
            <strong>Location:</strong>
            ${escapeHtml(project.location || "-")}
        </p>

        <p>
            <strong>Client:</strong>
            ${escapeHtml(project.client || "-")}
        </p>

        <p>
            <strong>Building Type:</strong>
            ${escapeHtml(project.buildingType || "-")}
        </p>

        <p>
            <strong>Floors:</strong>
            G + ${project.floors || 0}
        </p>

        <p>
            <strong>Basements:</strong>
            ${project.basements || 0}
        </p>

    `;

}



/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHtml(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}



/* =========================================================
   QUANTITY CALCULATION
========================================================= */

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
        totalRcc.toFixed(2) +
        " m³";


    document.getElementById(
        "steelResult"
    ).textContent =
        quantities.steel.toFixed(2) +
        " MT";


    localStorage.setItem(
        "constructionQuantities",
        JSON.stringify(quantities)
    );


    calculateCost();


    alert(
        "Quantities calculated!"
    );

}



/* =========================================================
   LOAD QUANTITIES
========================================================= */

function loadQuantities() {

    const saved =
        localStorage.getItem(
            "constructionQuantities"
        );


    if (saved) {

        try {

            quantities =
                JSON.parse(saved);

        } catch (error) {

            console.error(
                "Unable to load quantities:",
                error
            );

        }

    }


    const fields = {

        foundationRcc:
            quantities.foundationRcc,

        columnRcc:
            quantities.columnRcc,

        beamRcc:
            quantities.beamRcc,

        slabRcc:
            quantities.slabRcc,

        shearWallRcc:
            quantities.shearWallRcc,

        staircaseRcc:
            quantities.staircaseRcc,

        steelQuantity:
            quantities.steel,

        masonryQuantity:
            quantities.masonry,

        plasterQuantity:
            quantities.plaster,

        flooringQuantity:
            quantities.flooring,

        paintingQuantity:
            quantities.painting

    };


    Object.keys(fields).forEach(id => {

        const element =
            document.getElementById(id);


        if (element) {

            element.value =
                fields[id] || 0;

        }

    });


    updateQuantityDisplay();

}



/* =========================================================
   QUANTITY DISPLAY
========================================================= */

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
        totalRcc.toFixed(2) +
        " m³";


    document.getElementById(
        "steelResult"
    ).textContent =
        quantities.steel.toFixed(2) +
        " MT";

}



/* =========================================================
   LOAD RATES FROM FORM
========================================================= */

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



/* =========================================================
   LOAD RATES
========================================================= */

function loadRates() {

    const saved =
        localStorage.getItem(
            "constructionRates"
        );


    if (saved) {

        try {

            rates =
                JSON.parse(saved);

        } catch (error) {

            console.error(
                "Unable to load rates:",
                error
            );

        }

    }


    const fields = {

        rccRate: rates.rcc,

        steelRate: rates.steel,

        masonryRate: rates.masonry,

        plasterRate: rates.plaster,

        flooringRate: rates.flooring,

        paintingRate: rates.painting,

        labourCost: rates.labour,

        mepCost: rates.mep,

        equipmentCost: rates.equipment,

        overheadCost: rates.overhead,

        contingencyCost:
            rates.contingency

    };


    Object.keys(fields).forEach(id => {

        const element =
            document.getElementById(id);


        if (element) {

            element.value =
                fields[id];

        }

    });

}



/* =========================================================
   BOQ ROW NUMBER
========================================================= */

function getChildSerial(parentSno, index) {

    if (index === 0) {

        return parentSno;

    }


    return parentSno +
        String.fromCharCode(
            64 + index
        );

}



/* =========================================================
   ADD BOQ ROW
========================================================= */

function addBoqRow(parentId) {

    const parent =
        boqRows.find(
            row => row.id === parentId
        );


    if (!parent) {

        return;

    }


    const parentSno =
        parent.sno;


    const sameGroup =
        boqRows.filter(row => {

            if (row.id === parentId) {

                return true;

            }


            return row.sno
                .toString()
                .startsWith(
                    parentSno
                );

        });


    const childCount =
        sameGroup.length;


    const newSno =
        getChildSerial(
            parentSno,
            childCount
        );


    let description =
        parent.description;


    /*
       Special requirement:

       Painting 1st Coat
       + row => Painting 2nd Coat
       + row => Painting 3rd Coat
    */

    if (
        parent.description
            .startsWith("Painting")
    ) {

        description =
            "Painting " +
            getOrdinal(childCount + 1) +
            " Coat";

    }


    const newRow = {

        id: nextBoqId++,

        sno: newSno,

        description: description,

        l: 0,

        b: 0,

        dt: 0,

        quantity: 0,

        unit: parent.unit,

        rate: parent.rate

    };


    const parentIndex =
        boqRows.findIndex(
            row => row.id === parentId
        );


    boqRows.splice(
        parentIndex + 1,
        0,
        newRow
    );


    renumberBoqRows();


    renderBoq();

}



/* =========================================================
   ORDINAL
========================================================= */

function getOrdinal(number) {

    const suffix =
        ["th", "st", "nd", "rd"][
            number % 100 >= 11 &&
            number % 100 <= 13
                ? 0
                : number % 10 < 4
                    ? number % 10
                    : 0
        ];


    return number + suffix;

}



/* =========================================================
   RENUMBER BOQ
========================================================= */

function renumberBoqRows() {

    const counters = {};


    boqRows.forEach(row => {

        const base =
            parseInt(
                row.sno
            );


        if (
            !Number.isFinite(base)
        ) {

            return;

        }


        if (
            !counters[base]
        ) {

            counters[base] = 0;

        }


        counters[base]++;


        if (
            counters[base] === 1
        ) {

            row.sno =
                String(base);

        } else {

            row.sno =
                String(base) +
                String.fromCharCode(
                    64 + counters[base] - 1
                );

        }

    });

}



/* =========================================================
   REMOVE BOQ ROW
========================================================= */

function removeBoqRow(id) {

    const index =
        boqRows.findIndex(
            row => row.id === id
        );


    if (index === -1) {

        return;

    }


    if (boqRows.length <= 1) {

        return;

    }


    boqRows.splice(
        index,
        1
    );


    renderBoq();

}



/* =========================================================
   UPDATE BOQ FIELD
========================================================= */

function updateBoqField(
    id,
    field,
    value
) {

    const row =
        boqRows.find(
            item => item.id === id
        );


    if (!row) {

        return;

    }


    if (
        field === "description"
    ) {

        row[field] =
            value;

    } else if (
        field === "unit"
    ) {

        row[field] =
            value;

    } else {

        row[field] =
            parseFloat(value) || 0;

    }


    calculateRowQuantity(row);


    renderBoq();

}



/* =========================================================
   CALCULATE ROW QUANTITY
========================================================= */

function calculateRowQuantity(row) {

    const l =
        Number(row.l) || 0;


    const b =
        Number(row.b) || 0;


    const dt =
        Number(row.dt) || 0;


    /*
       m³:
       L × B × D/T

       m²:
       L × B
    */

    if (row.unit === "m³") {

        row.quantity =
            l * b * dt;

    } else {

        row.quantity =
            l * b;

    }

}



/* =========================================================
   RENDER BOQ
========================================================= */

function renderBoq() {

    const table =
        document.getElementById(
            "boqTable"
        );


    if (!table) {

        return;

    }


    table.innerHTML = "";


    let total = 0;


    boqRows.forEach(row => {

        calculateRowQuantity(row);


        const amount =
            row.quantity *
            (Number(row.rate) || 0);


        total += amount;


        const tr =
            document.createElement("tr");


        tr.innerHTML = `

            <td>
                <strong>
                    ${escapeHtml(row.sno)}
                </strong>
            </td>


            <td>

                <input
                    class="boq-input description-input"
                    type="text"
                    value="${escapeHtml(row.description)}"
                    onchange="
                        updateBoqField(
                            ${row.id},
                            'description',
                            this.value
                        )
                    ">

            </td>


            <td>

                <input
                    class="boq-input"
                    type="number"
                    step="0.01"
                    value="${row.l}"
                    onchange="
                        updateBoqField(
                            ${row.id},
                            'l',
                            this.value
                        )
                    ">

            </td>


            <td>

                <input
                    class="boq-input"
                    type="number"
                    step="0.01"
                    value="${row.b}"
                    onchange="
                        updateBoqField(
                            ${row.id},
                            'b',
                            this.value
                        )
                    ">

            </td>


            <td>

                <input
                    class="boq-input"
                    type="number"
                    step="0.01"
                    value="${row.dt}"
                    onchange="
                        updateBoqField(
                            ${row.id},
                            'dt',
                            this.value
                        )
                    ">

            </td>


            <td>
                ${row.quantity.toFixed(2)}
            </td>


            <td>

                <select
                    class="unit-select"
                    onchange="
                        updateBoqField(
                            ${row.id},
                            'unit',
                            this.value
                        )
                    ">

                    <option
                        value="m³"
                        ${row.unit === "m³"
                            ? "selected"
                            : ""}>
                        m³
                    </option>

                    <option
                        value="m²"
                        ${row.unit === "m²"
                            ? "selected"
                            : ""}>
                        m²
                    </option>

                </select>

            </td>


            <td>

                <input
                    class="boq-input"
                    type="number"
                    step="0.01"
                    value="${row.rate}"
                    onchange="
                        updateBoqField(
                            ${row.id},
                            'rate',
                            this.value
                        )
                    ">

            </td>


            <td class="amount-cell">

                ${formatCurrency(amount)}

            </td>


            <td>

                <button
                    class="add-row-btn"
                    title="Add row"
                    onclick="
                        addBoqRow(${row.id})
                    ">

                    +

                </button>

                <button
                    class="remove-row-btn"
                    title="Remove row"
                    onclick="
                        removeBoqRow(${row.id})
                    ">

                    ×

                </button>

            </td>

        `;


        table.appendChild(tr);

    });


    document.getElementById(
        "boqTotal"
    ).textContent =
        formatCurrency(total);


    updateSummaryFromBoq(total);

}



/* =========================================================
   BOQ TOTAL
========================================================= */

function getBoqTotal() {

    return boqRows.reduce(
        (total, row) => {

            calculateRowQuantity(row);


            return total +
                (
                    row.quantity *
                    (Number(row.rate) || 0)
                );

        },
        0
    );

}



/* =========================================================
   SUMMARY
========================================================= */

function updateSummaryFromBoq(
    boqTotal
) {

    const summary =
        document.getElementById(
            "summaryBreakdown"
        );


    if (!summary) {

        return;

    }


    summary.innerHTML = "";


    boqRows.forEach(row => {

        const amount =
            row.quantity *
            (Number(row.rate) || 0);


        const p =
            document.createElement("p");


        p.innerHTML = `

            <strong>
                ${escapeHtml(row.sno)}
                -
                ${escapeHtml(row.description)}
            </strong>

            :

            ${formatCurrency(amount)}

        `;


        summary.appendChild(p);

    });


    summary.innerHTML += `

        <p class="summary-total">

            <strong>
                TOTAL
            </strong>

            :

            <strong>
                ${formatCurrency(boqTotal)}
            </strong>

        </p>

    `;

}



/* =========================================================
   TOTAL PROJECT COST
========================================================= */

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
        totalRcc *
        rates.rcc;


    const steelCost =
        quantities.steel *
        rates.steel;


    const masonryCost =
        quantities.masonry *
        rates.masonry;


    const plasterCost =
        quantities.plaster *
        rates.plaster;


    const flooringCost =
        quantities.flooring *
        rates.flooring;


    const paintingCost =
        quantities.painting *
        rates.painting;


    const civilCost =
        rccCost +
        steelCost +
        masonryCost +
        plasterCost +
        flooringCost +
        paintingCost;


    return (
        civilCost +
        rates.labour +
        rates.mep +
        rates.equipment +
        rates.overhead +
        rates.contingency
    );

}



/* =========================================================
   COST CALCULATION
========================================================= */

function calculateCost() {

    loadRatesFromForm();


    renderBoq();


    const total =
        calculateTotalCost();


    const boqTotal =
        getBoqTotal();


    /*
       Use BOQ total if rows contain data.
       Otherwise use existing project cost calculation.
    */

    const finalTotal =
        boqTotal > 0
            ? boqTotal
            : total;


    const totalProjectCost =
        document.getElementById(
            "totalProjectCost"
        );


    if (totalProjectCost) {

        totalProjectCost.textContent =
            formatCurrency(finalTotal);

    }


    const costPerSqft =
        project.builtUpArea > 0
            ? finalTotal /
              project.builtUpArea
            : 0;


    const costPerSqftElement =
        document.getElementById(
            "costPerSqft"
        );


    if (costPerSqftElement) {

        costPerSqftElement.textContent =
            formatCurrency(
                costPerSqft
            );

    }


    const dashboardCost =
        document.getElementById(
            "dashboardCost"
        );


    if (dashboardCost) {

        dashboardCost.textContent =
            formatCurrency(
                finalTotal
            );

    }


    return finalTotal;

}



/* =========================================================
   CREATE EXCEL DATA
========================================================= */

function createExcelData() {

    const rows = [];


    /*
       Project information
    */

    rows.push([
        "Construction Cost Estimator"
    ]);


    rows.push([
        "Project",
        project.name || ""
    ]);


    rows.push([
        "Location",
        project.location || ""
    ]);


    rows.push([
        "Client",
        project.client || ""
    ]);


    rows.push([
        "Building Type",
        project.buildingType || ""
    ]);


    rows.push([
        "Built-up Area",
        project.builtUpArea || 0,
        "sq.ft"
    ]);


    rows.push([]);


    /*
       BOQ header
    */

    rows.push([

        "S.No",

        "Description",

        "L",

        "B",

        "D/T",

        "Quantity",

        "Unit",

        "Rate",

        "Amount"

    ]);


    /*
       BOQ rows
    */

    boqRows.forEach(row => {

        calculateRowQuantity(row);


        const amount =
            row.quantity *
            (Number(row.rate) || 0);


        rows.push([

            row.sno,

            row.description,

            Number(row.l) || 0,

            Number(row.b) || 0,

            Number(row.dt) || 0,

            Number(
                row.quantity.toFixed(2)
            ),

            row.unit,

            Number(row.rate) || 0,

            Number(
                amount.toFixed(2)
            )

        ]);

    });


    /*
       TOTAL ROW

       Amount is numeric so Excel
       recognizes it correctly.
    */

    const total =
        getBoqTotal();


    rows.push([

        "",

        "",

        "",

        "",

        "",

        "",

        "",

        "TOTAL",

        Number(
            total.toFixed(2)
        )

    ]);


    return rows;

}



/* =========================================================
   EXPORT REAL XLSX EXCEL FILE
========================================================= */

function exportExcel() {

    /*
       Make sure latest form values
       are loaded before exporting.
    */

    calculateQuantitiesSilently();

    loadRatesFromForm();


    /*
       Check SheetJS
    */

    if (
        typeof XLSX ===
        "undefined"
    ) {

        alert(
            "Excel library could not be loaded. Please check your internet connection and reload the page."
        );

        return;

    }


    const data =
        createExcelData();


    /*
       Create worksheet
    */

    const worksheet =
        XLSX.utils.aoa_to_sheet(
            data
        );


    /*
       Merge title
    */

    worksheet["!merges"] = [

        {
            s: {
                r: 0,
                c: 0
            },

            e: {
                r: 0,
                c: 8
            }
        }

    ];


    /*
       Column widths
    */

    worksheet["!cols"] = [

        {
            wch: 9
        },

        {
            wch: 28
        },

        {
            wch: 12
        },

        {
            wch: 12
        },

        {
            wch: 12
        },

        {
            wch: 14
        },

        {
            wch: 12
        },

        {
            wch: 16
        },

        {
            wch: 18
        }

    ];


    /*
       Header row number

       Row 0 = title
       Row 1 = project
       Row 2 = location
       Row 3 = client
       Row 4 = building
       Row 5 = area
       Row 6 = blank
       Row 7 = BOQ header
    */

    const headerRow = 7;


    /*
       Style title
    */

    if (worksheet["A1"]) {

        worksheet["A1"].s = {

            font: {
                bold: true,
                sz: 16
            },

            alignment: {
                horizontal: "center",
                vertical: "center"
            }

        };

    }


    /*
       Style BOQ header
    */

    for (
        let col = 0;
        col < 9;
        col++
    ) {

        const cell =
            XLSX.utils.encode_cell({

                r: headerRow,

                c: col

            });


        if (worksheet[cell]) {

            worksheet[cell].s = {

                font: {
                    bold: true
                },

                alignment: {

                    horizontal:
                        "center",

                    vertical:
                        "center",

                    wrapText:
                        true

                },

                border: {

                    top: {
                        style: "thin"
                    },

                    bottom: {
                        style: "thin"
                    },

                    left: {
                        style: "thin"
                    },

                    right: {
                        style: "thin"
                    }

                }

            };

        }

    }


    /*
       Style BOQ data rows
    */

    const totalRows =
        data.length;


    for (
        let r = headerRow + 1;
        r < totalRows;
        r++
    ) {

        for (
            let c = 0;
            c < 9;
            c++
        ) {

            const cell =
                XLSX.utils.encode_cell({

                    r: r,

                    c: c

                });


            if (!worksheet[cell]) {

                continue;

            }


            worksheet[cell].s = {

                alignment: {

                    horizontal:
                        c === 1
                            ? "left"
                            : "center",

                    vertical:
                        "center"

                },

                border: {

                    top: {
                        style: "thin"
                    },

                    bottom: {
                        style: "thin"
                    },

                    left: {
                        style: "thin"
                    },

                    right: {
                        style: "thin"
                    }

                }

            };


            /*
               Rate and Amount
               should be numeric/currency.
            */

            if (
                c === 7 ||
                c === 8
            ) {

                worksheet[cell].z =
                    '₹#,##0.00';

                worksheet[cell].s.alignment
                    .horizontal =
                    "right";

            }

        }

    }


    /*
       Total row

       Last row in the worksheet
    */

    const totalRow =
        data.length - 1;


    for (
        let c = 0;
        c < 9;
        c++
    ) {

        const cell =
            XLSX.utils.encode_cell({

                r: totalRow,

                c: c

            });


        if (!worksheet[cell]) {

            continue;

        }


        worksheet[cell].s = {

            font: {
                bold: true
            },

            alignment: {

                horizontal:
                    c === 7 ||
                    c === 8
                        ? "right"
                        : "center",

                vertical:
                    "center"

            },

            border: {

                top: {
                    style: "thin"
                },

                bottom: {
                    style: "double"
                },

                left: {
                    style: "thin"
                },

                right: {
                    style: "thin"
                }

            }

        };


        if (c === 8) {

            worksheet[cell].z =
                '₹#,##0.00';

        }

    }


    /*
       Freeze BOQ header
    */

    worksheet["!freeze"] = {
        xSplit: 0,
        ySplit: 8
    };


    /*
       Create workbook
    */

    const workbook =
        XLSX.utils.book_new();


    XLSX.utils.book_append_sheet(

        workbook,

        worksheet,

        "BOQ"

    );


    /*
       Create second summary sheet
    */

    const summaryData = [

        [
            "Construction Cost Summary"
        ],

        [],

        [
            "Project",
            project.name || ""
        ],

        [
            "Location",
            project.location || ""
        ],

        [
            "Client",
            project.client || ""
        ],

        [
            "Built-up Area",
            project.builtUpArea || 0,
            "sq.ft"
        ],

        [],

        [
            "Total BOQ Amount",
            Number(
                getBoqTotal().toFixed(2)
            )
        ]

    ];


    const summarySheet =
        XLSX.utils.aoa_to_sheet(
            summaryData
        );


    summarySheet["!cols"] = [

        {
            wch: 25
        },

        {
            wch: 30
        },

        {
            wch: 15
        }

    ];


    if (
        summarySheet["A1"]
    ) {

        summarySheet["A1"].s = {

            font: {
                bold: true,
                sz: 16
            },

            alignment: {
                horizontal: "center"
            }

        };

    }


    if (
        summarySheet["B8"]
    ) {

        summarySheet["B8"].z =
            '₹#,##0.00';


        summarySheet["B8"].s = {

            font: {
                bold: true
            },

            alignment: {
                horizontal: "right"
            }

        };

    }


    XLSX.utils.book_append_sheet(

        workbook,

        summarySheet,

        "Summary"

    );


    /*
       File name
    */

    let fileName =
        project.name
            ? project.name
                .replace(
                    /[^a-z0-9]/gi,
                    "_"
                )
            : "construction";


    fileName +=
        "_BOQ.xlsx";


    /*
       Download actual XLSX
    */

    XLSX.writeFile(

        workbook,

        fileName

    );

}



/* =========================================================
   SILENT QUANTITY CALCULATION
========================================================= */

function calculateQuantitiesSilently() {

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


    localStorage.setItem(

        "constructionQuantities",

        JSON.stringify(
            quantities
        )

    );

}



/* =========================================================
   INITIALIZATION
========================================================= */

window.addEventListener(
    "DOMContentLoaded",
    function () {

        loadProject();

        loadQuantities();

        loadRates();

        renderBoq();

        calculateCost();

        showPage(
            "dashboardPage"
        );

    }
);
