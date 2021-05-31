function isSimplifiedFraction(num, den) {
    if (den == 1) {
        return false;
    } else if (num == 1) {
        return true;
    }
    if (num == den || num % den == 0 || den % num == 0) {
        return false;
    } 
    for (i = 2; i < Math.max(num, den); i++) {
        if (num % i == 0 && den % i == 0) {
            return false;
        }
    }
    return true;
}

function getEquation() {
    let m;
    let rise;
    let run;
    let eq;

    let b = Math.floor(Math.random() * 11) - 5

    if (b == 0) {
        b_str = "";
    } else if (b < 0) {
        b_str = b;
    } else {
        b_str = `+${b}`;
    }

    const percFraction = 0.5;
    const randNum = Math.random();
    let variable = "x";

    if (randNum < percFraction) {
        rise = Math.floor(Math.random() * 11) - 5
        run = Math.floor(Math.random() * 5) + 1

        while (!isSimplifiedFraction(Math.abs(rise), run)) {
            rise = Math.floor(Math.random() * 11) - 5
            run = Math.floor(Math.random() * 5) + 1
        };
        m = rise / run;
        if (rise < 0) {
            eq = `y=-\\frac{${Math.abs(rise)}}{${run}}${variable}${b_str}`;
        } else {
            eq = `y=\\frac{${rise}}{${run}}${variable}${b_str}`;
        }

    } else {
        m = Math.floor(Math.random() * 10) - 5
        let m_str = m;

        if (m == 0) {
            m_str = "";
            variable = "";
            if (b >= 0) {
                b_str = b;
            }
        } else if (m == 1) {
            m_str = "";
        } else if (m == -1) {
            m_str = "-";
        }
        rise = m;
        run = 1;

        eq = `y=${m_str}${variable}${b_str}`;
    }

    return {eq, m, b, rise, run}
}

