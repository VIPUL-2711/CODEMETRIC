// jab bhi dom content load ho jaeyga toh uspe yeh function apply kardo;
document.addEventListener("DOMContentLoaded", function () {

    // fetch all elemants and id from html using dom manipulation;
    const searchbutton = document.getElementById('search');
    const usernameinput = document.getElementById('place');
    const statscontainer = document.querySelector('.state-container');
    const easyproblem = document.querySelector('.easy-problem');
    const mediumproblem = document.querySelector('.medium-problem');
    const hardproblem = document.querySelector('.hard-problem');
    const easy = document.getElementById('easy');
    const medium = document.getElementById('medium');
    const hard = document.getElementById('hard');
    const statscard = document.querySelector('.stats-card'); // ✅ FIXED typo
    const easyratio = document.getElementById('easy-ratio');
    const mediumratio = document.getElementById('medium-ratio');
    const hardratio = document.getElementById('hard-ratio');

    //validate username is true or false based on regular expression and empty ;
    function validateusername(username) {
        if (username.trim() === "") {
            alert("username should not be empty");
            return false;
        }
        const regex = /^[a-zA-Z][a-zA-Z0-9_]{2,15}$/;
        const isMatching = regex.test(username);
        if (!isMatching) {
            alert("Invalid username");
        }
        return isMatching;
    }

    // function to update circular progress using css variable
    function updateCircle(circleElement, solved, total) {
        const percent = (solved / total) * 100;
        circleElement.parentElement.style.setProperty(
            "--progress-degree",
            `${percent}%`
        );
    }

    // fetching api put in bactacks(` `) ${} replace the username with some value;  
    async function fetchuserdetail(username) {
        const url = `https://leetcode-api-faisalshohag.vercel.app/${username}`;

        // after fetching url endpoint ,, if the data is found than it display ,,other wise showing finally block ;
        try {
            searchbutton.textContent = "searching...";
            searchbutton.disabled = true;

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("unable to read user data");
            }

            const data = await response.json();
            console.log("Logging data: ", data);

            // updating solved problems
            easy.textContent = data.easySolved;
            medium.textContent = data.mediumSolved;
            hard.textContent = data.hardSolved;

            // updating ratio text
            easyratio.textContent = `${data.easySolved} / ${data.totalEasy}`;
            mediumratio.textContent = `${data.mediumSolved} / ${data.totalMedium}`;
            hardratio.textContent = `${data.hardSolved} / ${data.totalHard}`;

            // updating circular progress
            updateCircle(easyproblem, data.easySolved, data.totalEasy);
            updateCircle(mediumproblem, data.mediumSolved, data.totalMedium);
            updateCircle(hardproblem, data.hardSolved, data.totalHard);

            // updating stats card
            statscard.innerHTML = `
                <p><strong>Total Solved:</strong> ${data.totalSolved}</p>
                <p><strong>Ranking:</strong> ${data.ranking}</p>
                <p><strong>Acceptance Rate:</strong> ${data.acceptanceRate}%</p>
            `;
        }

        catch (e) {
            statscontainer.innerHTML = `<p>No details found</p>`;
        }

        finally {
            searchbutton.textContent = "search";
            searchbutton.disabled = false;
        }
    }

    // jab bhi search button ko click kare toh yeh function run hojayeee;
    searchbutton.addEventListener("click", function () {
        const username = usernameinput.value;
        console.log("logging successful: ", username);

        if (validateusername(username)) {
            fetchuserdetail(username);
        }
    });

});
