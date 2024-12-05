class Field {
    constructor() {
        this.field = [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
        ];
        this.fieldDiv = [[], [], []];
        this.turn = Math.round(Math.random() + 1);

        document.getElementById(this.turn !== 1 ? "firstPlayer" : "secondPlayer").classList.remove(`active_${3-this.turn}`);
        document.getElementById(this.turn === 1 ? "firstPlayer" : "secondPlayer").classList.add(`active_${this.turn}`);
    }

    fillField(twoPlayers) {
        for (let i = 0; i < this.field.length; i++) {
            for (let j = 0; j < this.field[i].length; j++) {
                let div = document.createElement("div");
                div.classList.add("cell");
                div.setAttribute("style", `grid-row: ${i + 1}; grid-column: ${j + 1}`);
                div.dataset.row = i + "";
                div.dataset.column = j + "";


                div.addEventListener("click", twoPlayers ? this.setCell_twoPlayers : this.setCell_onePlayer);
                document.querySelector(".field").appendChild(div);
                this.fieldDiv[i][j] = div;
            }
        }
        if (this.turn === 2 && !twoPlayers) {
            this.setCell_onePlayer();
        }
    }

    setCell_onePlayer(event = null) {
        let isFinished = false;
        if (field.turn === 1) {
            document.querySelector('.cover').classList.remove(`hidden`);
            let div = event.currentTarget;

            div.innerText = 'X';
            field.field[div.dataset.row][div.dataset.column] = field.turn;
            div.style.color = '#fa2555';
            div.style.cursor = 'default';

            document.getElementById("firstPlayer").classList.remove(`active_1`);

            field.turn = 2;

            document.getElementById("secondPlayer").classList.add(`active_2`);

            div.removeEventListener("click", field.setCell_onePlayer);

            isFinished = field.setWinner(field.checkState(field.field));

        }
        document.querySelector('.cover').classList.add(`hidden`);
        if (!isFinished) {
            setTimeout(() => {
                field.botTurn()
            }, 340);
        }
    }

    setCell_twoPlayers(event) {
        let div = event.currentTarget;

        div.innerText = field.turn === 1 ? 'X' : 'O';
        field.field[div.dataset.row][div.dataset.column] = field.turn;
        div.style.color = field.turn === 1 ? '#fa2555' : '#2555fa';
        div.style.cursor = 'default';

        document.getElementById(field.turn === 1 ? "firstPlayer" : "secondPlayer").classList.remove(`active_${field.turn}`);

        field.turn = field.turn === 1 ? 2 : 1;

        document.getElementById(field.turn === 1 ? "firstPlayer" : "secondPlayer").classList.add(`active_${field.turn}`);

        div.removeEventListener("click", field.setCell_twoPlayers);

        field.setWinner(field.checkState(field.field));
    }

    checkState() {
        for (let i = 0; i < 3; i++) {
            if (this.field[i][0] === this.field[i][1] && this.field[i][1] === this.field[i][2] && this.field[i][1] !== 0) {
                return this.field[i][0];
            }
        }
        for (let i = 0; i < 3; i++) {
            if (this.field[0][i] === this.field[1][i] && this.field[1][i] === this.field[2][i] && this.field[0][i] !== 0) {
                return this.field[0][i];
            }
        }
        if (this.field[1][1] === this.field[0][0] && this.field[2][2] === this.field[1][1]) {
            return this.field[0][0];
        }
        if (this.field[0][2] === this.field[1][1] && this.field[1][1] === this.field[2][0]) {
            return this.field[0][2];
        }
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (this.field[i][j] === 0) return 0;
            }
        }
        return 3;
    }

    setWinner(winner) {
        if (winner !== 0) {
            document.querySelectorAll('.cell').forEach(el => {
                el.removeEventListener("click", field.setCell_twoPlayers);
                el.style.cursor = 'default';
            });
            document.querySelector('.afterGameNotification').style.display = 'flex';
            let massage = document.querySelector(".massage");
            if (winner === 1) {
                massage.style.color = '#fa2555';
                massage.innerText = 'Red won';
                let score = document.getElementById('firstPlayer');
                score.innerText = 'R: ' + (Number(score.textContent.substring(score.textContent.lastIndexOf(" ") + 1)) + 1);
            } else if (winner === 2) {
                massage.style.color = '#2555fa';
                massage.innerText = 'Blue won';
                let score = document.getElementById('secondPlayer');
                score.innerText = Number(score.textContent.substring(0, score.textContent.indexOf(" "))) + 1 + " :B";
            } else if (winner === 3) {
                massage.style.color = '#f1f1f1';
                massage.innerText = 'draw';
            }
            return true;
        }
        return false;
    }

    botTurn() {
        let setElement = (x, y) => {
            this.fieldDiv[x][y].innerText = "O";
            this.fieldDiv[x][y].removeEventListener("click", this.setCell_onePlayer);
            this.fieldDiv[x][y].style.color = '#2555fa';
            this.fieldDiv[x][y].style.cursor = 'default';
            document.getElementById("secondPlayer").classList.remove(`active_2`);
            this.turn = 1;
            document.getElementById("firstPlayer").classList.add(`active_1`);
            this.setWinner(this.checkState());
        }

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (this.field[i][j] === 0) {
                    this.field[i][j] = 2;
                    if (this.checkState(this.field) === 2) {
                        this.field[i][j] = 2;
                        setElement(i, j);
                        return;
                    }
                    this.field[i][j] = 1;
                    if (this.checkState(this.field) === 1) {
                        this.field[i][j] = 2;
                        setElement(i, j);
                        return;
                    }
                    this.field[i][j] = 0;
                }
            }
        }
        if (this.field[1][1] === 0) {
            this.field[1][1] = 2;
            setElement(1, 1);
            return;
        }

        for (let i = 0; i < 3; i += 2) {
            for (let j = 0; j < 3; j += 2) {
                if (this.field[i][j] === 0) {
                    this.field[i][j] = 2;
                    setElement(i, j);
                    return;
                }
            }
        }

        let empty = this.field[0][1] !== 0 ? null : [0, 1];

        for (let i = 0; i < 3; i++) {
            if (i % 2 === 0) {
                if (this.field[i][1] === 0 && this.field[2 - i][1] === 0) {
                    this.field[i][1] = 2;
                    setElement(i, 1);
                    return;
                }

                if (empty === null && this.field[i][1] === 0) empty = [i, 1];
            } else {
                if (this.field[i][0] === 0 && empty === null) empty = [i, 1];
                if (this.field[i][2] === 0 && empty === null) empty = [i, 2];
                if (this.field[i][0] === 0 && this.field[i][2] === 0) {
                    this.field[i][0] = 2;
                    setElement(i, 0);
                    return;
                }
            }
        }

        this.field[empty[0]][empty[1]] = 2;
        setElement(empty[0], empty[1]);
    }
}

let field = new Field();

field.fillField(document.getElementById("switch").checked);

function changeMode() {
    restart();

    document.getElementById("firstPlayer").innerText = "R: 0";
    document.getElementById("secondPlayer").innerText = "0 :B";
}

function restart() {
    document.querySelectorAll('.cell').forEach(el => {
        el.remove();
    });
    field = new Field();
    field.fillField(document.getElementById("switch").checked);
    document.querySelector('.afterGameNotification').style.display = 'none';
}