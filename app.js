; (function () {

    angular.module("codePartners", [])

        .component("builder", {
            templateUrl: "builder.html",
            controller: BuilderController,
            controllerAs: "bc"
        })

        .component("pairUp", {
            templateUrl: "pair-up.html",
            controller: PairController,
            controllerAs: "pc",
            bindings: {
                students: "<",
                groupSize: "<"
            }
        })

    function BuilderController() {
        var bc = this;
        bc.studentArr = [];
        bc.studentArr2 = [];
        bc.killer = "Clear Students";
        bc.adder = false;
        bc.lookey = false;
        bc.name = "";
        bc.dropOne = false;
        bc.groupSize = 2;

        // bc.loadStudents();
        bc.studentArr = JSON.parse(localStorage.getItem("codePartners")) || [];


        bc.addStudent = function (newName) {
            let person = {
                name: newName,
                present: true
            }
            bc.name = "";
            bc.studentArr.unshift(person);
            localStorage.setItem("codePartners", JSON.stringify(bc.studentArr));
        }

        bc.loadStudents = function () {
            bc.studentArr = JSON.parse(localStorage.getItem("codePartners"));
        }

        bc.confirmRemove = function (name) {
            bc.dropOne = true;
            alert(`Click the badge to confirm dropping ${name}.`)
        }

        bc.dropStudent = function (name) {
            for (let i = 0; i < bc.studentArr.length; i++) {
                if (bc.studentArr[i].name == name) {
                    bc.studentArr.splice(i, 1);
                }
                bc.studentArr[i].present = true;
            }
            localStorage.setItem("codePartners", JSON.stringify(bc.studentArr));
            bc.dropOne = false;
        }

        bc.confirmKill = function () {
            bc.killer = "Confirm?";
            alert("This action will kill the current list");
        }

        bc.clearStudents = function (doIt) {
            if (doIt == "yes") {
                bc.studentArr = [];
                localStorage.setItem("codePartners", JSON.stringify(bc.studentArr));
            } else {
                alert("That was close!")
            }
            bc.killer = "Clear Students";
        }
    }//end of BuilderController

    function PairController() {
        var pc = this;
        var absent = 0;
        let tempName = "";
        let numberOfGroups = 0;
        let randNum = -1;
        pc.how = "L";
        pc.underFlowAlert = 0;
        pc.underFlowAlert2 = 0;
        pc.underFlowShow = 0;
        pc.groups = [];

        groupEm();

        function groupEm() {
            absent = countAbsent();
            underFlow(absent);
        }

        function countAbsent() {
            let flag = 0;
            for (let i = 0; i < pc.students.length; i++) {
                if (!pc.students[i].present) {
                    flag++;
                }
            }
            return flag;
        }

        function underFlow(absent) {
            pc.underFlowAlert = (pc.students.length - absent) % pc.groupSize;
            pc.underFlowAlert2 = pc.underFlowAlert;
            if (pc.underFlowAlert != 0) {
                pc.underFlowShow = 1;
                //Group size doesn't allow for equal distribution. How shall I proceed?;
            } else {
                pc.underFlowShow = 2;
                //Group size allows for equal distribution.;
            }
        }

        function makeRand() {
            return Math.floor(Math.random() * pc.students.length);
        }

        function grabName() {
            let grabbed = "";
            while (!grabbed) {
                randNum = makeRand();
                grabbed = pc.students.splice(randNum, 1);
                if (!grabbed[0].present) {
                    grabbed = "";
                    continue;
                }
            }
            return grabbed[0];
        }

        pc.numOfGrps = function () {
            return Math.floor((pc.students.length - absent) / pc.groupSize)
        }

        pc.assembleGroups = function (how) {
            // function assemblePairs() {
            numberOfGroups = pc.numOfGrps();
            switch (how) {
                case "L"://leave alone
                    if (pc.underFlowAlert) {
                        numberOfGroups++;
                    }
                    for (let ng = 0; ng < numberOfGroups; ng++) {
                        pc.groups[ng] = [];
                        for (let gs = 0; gs < pc.groupSize; gs++) {
                            tempName = grabName();
                            pc.groups[ng].push(tempName)
                            if (!pc.students.length) {
                                break;
                            }
                        }
                    }
                    break;
                case "B"://Make bigger
                    for (let ng = 0; ng < numberOfGroups; ng++) {
                        pc.groups[ng] = [];
                        for (let gs = 0; gs < pc.groupSize; gs++) {
                            if (!gs && pc.underFlowAlert) {
                                tempName = grabName();
                                pc.groups[ng].push(tempName);
                                pc.underFlowAlert--;
                            }
                            tempName = grabName();
                            pc.groups[ng].push(tempName);
                        }
                    }
                    break;
                case "S"://Make smaller
                    debugger
                    numberOfGroups++;
                    if (numberOfGroups == pc.underFlowAlert) {
                        pc.groupSize--;
                        pc.underFlowAlert = 0;
                    } else {
                        pc.underFlowAlert = numberOfGroups - pc.underFlowAlert;
                    }
                    for (let ng = 0; ng < numberOfGroups; ng++) {
                        pc.groups[ng] = [];
                        for (let gs = 0; gs < pc.groupSize; gs++) {
                            if (!gs && pc.underFlowAlert) {
                                gs++;
                                pc.underFlowAlert--;
                            }
                            tempName = grabName();
                            pc.groups[ng].push(tempName);
                        }
                    }
                    break;
            }

        }//end of assembleGroups

    }//end of PairController

} ());
const author = "Bert Allen";