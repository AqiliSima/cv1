const SEMESTER_START = new Date(2026, 8, 1);
const SEMESTER_END = new Date(2027, 1, 14);
const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");

if (navToggle && siteNav) {
    navToggle.addEventListener("click", () => {
        const isOpen = navToggle.getAttribute("aria-expanded") === "true";

        navToggle.setAttribute("aria-expanded", String(!isOpen));
        siteNav.classList.toggle("is-open", !isOpen);
    });

    siteNav.addEventListener("click", (event) => {
        if (event.target.matches(".site-nav__link")) {
            navToggle.setAttribute("aria-expanded", "false");
            siteNav.classList.remove("is-open");
        }
    });
}


/* Workspace hotspots */

const workspaceHotspots = [
    {
        id: "monitor",
        label: "Monitor",
        number: "1",
        top: "54%",
        left: "38%"
    },
    {
        id: "keyboard",
        label: "Klávesnica",
        number: "2",
        top: "72%",
        left: "48%"
    },
    {
        id: "mouse",
        label: "Myš",
        number: "3",
        top: "67%",
        left: "54%"
    },
    {
        id: "laptop",
        label: "Notebook",
        number: "4",
        top: "66%",
        left: "39%"
    },
    {
        id: "notebook",
        label: "Poznámkový blok",
        number: "5",
        top: "83%",
        left: "46%"
    },
    {
        id: "headphones",
        label: "Slúchadlá",
        number: "6",
        top: "52%",
        left: "63%"
    }
];

const hotspotsContainer = document.querySelector("#workspace-hotspots");
const workspacePanels = document.querySelector("#workspace-panels");

if (hotspotsContainer && workspacePanels) {

    workspaceHotspots.forEach((hotspot) => {

        const button = document.createElement("button");

        button.type = "button";
        button.className = "workspace__hotspot";
        button.textContent = hotspot.number;
        button.setAttribute("aria-label", hotspot.label);
        button.setAttribute("aria-controls", `panel-${hotspot.id}`);

        button.style.top = hotspot.top;
        button.style.left = hotspot.left;

        hotspotsContainer.appendChild(button);

        button.addEventListener("click", () => {

            const panels = workspacePanels.querySelectorAll(
                ".workspace__panel"
            );

            panels.forEach((panel) => {
                panel.classList.remove("is-active");
            });

            const emptyPanel = workspacePanels.querySelector(
                ".workspace__empty"
            );

            if (emptyPanel) {
                emptyPanel.style.display = "none";
            }

            const selectedPanel = document.querySelector(
                `#panel-${hotspot.id}`
            );

            if (selectedPanel) {
                selectedPanel.classList.add("is-active");
            }

            const buttons = hotspotsContainer.querySelectorAll(
                ".workspace__hotspot"
            );

            buttons.forEach((item) => {
                item.setAttribute("aria-current", "false");
            });

            button.setAttribute("aria-current", "true");
        });
    });
}

/* Schedule filters and current lesson */

const scheduleFilters = document.querySelectorAll(".schedule-filter");
const scheduleLessons = document.querySelectorAll(".schedule-table .lesson");
const scheduleNoResults = document.querySelector("#schedule-no-results");
const scheduleStatus = document.querySelector("#schedule-status");

if (scheduleFilters.length > 0 && scheduleLessons.length > 0) {

    scheduleFilters.forEach((filterButton) => {

        filterButton.addEventListener("click", () => {

            const selectedFilter = filterButton.dataset.filter;
            let visibleLessons = 0;

            scheduleFilters.forEach((button) => {
                button.classList.remove("is-active");
                button.setAttribute("aria-pressed", "false");
            });

            filterButton.classList.add("is-active");
            filterButton.setAttribute("aria-pressed", "true");

            scheduleLessons.forEach((lesson) => {

                const lessonType = lesson.dataset.type;

                if (
                    selectedFilter === "all" ||
                    lessonType === selectedFilter
                ) {
                    lesson.style.display = "";
                    visibleLessons++;
                } else {
                    lesson.style.display = "none";
                }

            });

            if (scheduleNoResults) {
                scheduleNoResults.hidden = visibleLessons !== 0;
            }

        });

    });

}


/* Current day and time */

function updateScheduleStatus() {

    if (!scheduleStatus || scheduleLessons.length === 0) {
        return;
    }

    const now = new Date();

    const currentDay = now.getDay();
    const currentMinute =
        now.getHours() * 60 + now.getMinutes();

    scheduleLessons.forEach((lesson) => {
        lesson.classList.remove("is-current");
    });

    let currentLesson = null;
    let nextLesson = null;

    scheduleLessons.forEach((lesson) => {

        const lessonDay = Number(lesson.dataset.day);

        const startParts = lesson.dataset.start.split(":");
        const endParts = lesson.dataset.end.split(":");

        const startMinutes =
            Number(startParts[0]) * 60 +
            Number(startParts[1]);

        const endMinutes =
            Number(endParts[0]) * 60 +
            Number(endParts[1]);

        if (
            lessonDay === currentDay &&
            currentMinute >= startMinutes &&
            currentMinute < endMinutes
        ) {
            currentLesson = lesson;
        }

        if (
            lessonDay === currentDay &&
            startMinutes > currentMinute &&
            (!nextLesson ||
                startMinutes <
                Number(nextLesson.dataset.start.split(":")[0]) * 60 +
                Number(nextLesson.dataset.start.split(":")[1]))
        ) {
            nextLesson = lesson;
        }

    });

    if (currentLesson) {

        currentLesson.classList.add("is-current");

        const subject =
            currentLesson.querySelector("strong").textContent;

        const type =
            currentLesson.querySelector("span").textContent;

        const time =
            currentLesson.querySelector("small").textContent;

        scheduleStatus.textContent =
            `Práve prebieha: ${subject} – ${type} (${time}).`;

        return;
    }

    if (nextLesson) {

        const subject =
            nextLesson.querySelector("strong").textContent;

        const type =
            nextLesson.querySelector("span").textContent;

        const time =
            nextLesson.querySelector("small").textContent;

        scheduleStatus.textContent =
            `Momentálne nemám vyučovanie. Ďalšia hodina: ${subject} – ${type} (${time}).`;

        return;
    }

    scheduleStatus.textContent =
        "Momentálne nemám vyučovanie a dnes už nemám ďalšiu hodinu.";

}


/* Update current lesson */

updateScheduleStatus();

setInterval(updateScheduleStatus, 60000);

/* Semester progress */

const semesterProgress = document.querySelector(
    ".semester-progress__bar"
);

const semesterProgressFill = document.querySelector(
    "#semester-progress-fill"
);

const semesterProgressText = document.querySelector(
    "#semester-progress-text"
);

function updateSemesterProgress() {

    if (
        !semesterProgress ||
        !semesterProgressFill ||
        !semesterProgressText
    ) {
        return;
    }

    const today = new Date();

    const totalTime =
        SEMESTER_END.getTime() -
        SEMESTER_START.getTime();

    const elapsedTime =
        today.getTime() -
        SEMESTER_START.getTime();

    let percentage =
        (elapsedTime / totalTime) * 100;

    percentage = Math.max(
        0,
        Math.min(100, percentage)
    );

    semesterProgressFill.style.width =
        `${percentage}%`;

    semesterProgress.setAttribute(
        "aria-valuenow",
        Math.round(percentage)
    );

    semesterProgressText.textContent =
        `Uplynulo ${Math.round(percentage)} % semestra.`;
}

updateSemesterProgress();








/* Map */

const mapElement = document.querySelector("#map");

if (mapElement) {

    const schoolLocation = [48.151965, 17.072995];
    const homeLocation = [48.146, 17.107];

    const map = L.map("map").setView(
        schoolLocation,
        14
    );

    L.tileLayer(
        "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            maxZoom: 19,
            attribution:
                "&copy; OpenStreetMap contributors"
        }
    ).addTo(map);


    /* Permanent locations */

    L.marker(schoolLocation)
        .addTo(map)
        .bindPopup("FEI STU Bratislava");

    L.marker(homeLocation)
        .addTo(map)
        .bindPopup("Moje približné bydlisko");


    /* Map elements */

    let selectedLocation = null;

    let points =
        JSON.parse(localStorage.getItem("mapPoints")) || [];

    let routeLine = null;


    const pointName =
        document.querySelector("#point-name");

    const savePointButton =
        document.querySelector("#save-point");

    const pointList =
        document.querySelector("#point-list");

    const destination =
        document.querySelector("#destination");

    const calculateButton =
        document.querySelector("#calculate-distance");

    const mapMessage =
        document.querySelector("#map-message");

    const distanceResult =
        document.querySelector("#distance-result");

    const savedPoints =
        document.querySelector("#saved-points");


    /* Show saved points */

    function showPoints() {

        pointList.innerHTML =
            '<option value="">Vyberte bod</option>';

        savedPoints.innerHTML = "";


        points.forEach((point, index) => {

            const option =
                document.createElement("option");

            option.value = index;
            option.textContent = point.name;

            pointList.appendChild(option);


            const item =
                document.createElement("p");

            item.textContent = point.name;

            savedPoints.appendChild(item);


            L.marker([point.lat, point.lng])
                .addTo(map)
                .bindPopup(point.name);

        });


        if (points.length === 0) {

            savedPoints.innerHTML =
                '<p class="map__empty">Zatiaľ nemáte pridané žiadne vlastné body.</p>';

        }

    }


    showPoints();


    /* Select location on map */

    map.on("click", function (event) {

        selectedLocation = event.latlng;

        mapMessage.textContent =
            "Bod bol vybraný. Zadajte jeho názov a kliknite na Uložiť bod.";

    });


    /* Save new point */

    savePointButton.addEventListener("click", function () {

        if (!selectedLocation) {

            mapMessage.textContent =
                "Najprv kliknite na miesto na mape.";

            return;
        }


        const name =
            pointName.value.trim();


        if (name === "") {

            mapMessage.textContent =
                "Zadajte názov bodu.";

            return;
        }


        const point = {

            name: name,
            lat: selectedLocation.lat,
            lng: selectedLocation.lng

        };


        points.push(point);


        localStorage.setItem(
            "mapPoints",
            JSON.stringify(points)
        );


        showPoints();


        pointName.value = "";

        mapMessage.textContent =
            "Bod bol uložený.";

        selectedLocation = null;

    });


    /* Calculate distance */

    calculateButton.addEventListener("click", function () {

        if (pointList.value === "") {

            distanceResult.textContent =
                "Najprv vyberte bod.";

            return;
        }


        const point =
            points[Number(pointList.value)];


        let destinationLocation;

        let destinationName;


        if (destination.value === "school") {

            destinationLocation =
                schoolLocation;

            destinationName =
                "FEI STU Bratislava";

        } else {

            destinationLocation =
                homeLocation;

            destinationName =
                "Moje približné bydlisko";

        }


        const distance =
            calculateDistance(
                point.lat,
                point.lng,
                destinationLocation[0],
                destinationLocation[1]
            );


        distanceResult.textContent =
            `Vzdialenosť medzi ${point.name} a ${destinationName} je ${distance.toFixed(2)} km.`;


        /* Draw route */

        if (routeLine) {

            map.removeLayer(routeLine);

        }


        routeLine = L.polyline(
            [
                [point.lat, point.lng],
                destinationLocation
            ],
            {
                color: "#e89b3c",
                weight: 4
            }
        ).addTo(map);


        map.fitBounds(routeLine.getBounds());


    });


    /* Calculate distance with Haversine formula */

    function calculateDistance(
        lat1,
        lon1,
        lat2,
        lon2
    ) {

        const earthRadius = 6371;


        const latDifference =
            (lat2 - lat1) * Math.PI / 180;

        const lonDifference =
            (lon2 - lon1) * Math.PI / 180;


        const a =
            Math.sin(latDifference / 2) *
            Math.sin(latDifference / 2) +
            Math.cos(lat1 * Math.PI / 180) *
            Math.cos(lat2 * Math.PI / 180) *
            Math.sin(lonDifference / 2) *
            Math.sin(lonDifference / 2);


        const c =
            2 * Math.atan2(
                Math.sqrt(a),
                Math.sqrt(1 - a)
            );


        return earthRadius * c;

    }

}