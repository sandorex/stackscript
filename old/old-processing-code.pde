import java.util.Vector;
import java.util.HashMap;

public static final int FLAG_NULL = 0;
public static final int FLAG_X = (1 << 0);
public static final int FLAG_UP = (1 << 1);
public static final int FLAG_DOWN = (1 << 2);
public static final int FLAG_LEFT = (1 << 3);
public static final int FLAG_RIGHT = (1 << 4);
public static final int FLAG_DASH = (1 << 5);
public static final int FLAG_DASH2 = (1 << 6);
public static final int FLAG_DOUBLE_DASH = FLAG_DASH | FLAG_DASH2;

public static final HashMap<String, Integer> LETTERS = new HashMap<String, Integer>();
static {
    // blocky letters
    // first row
    LETTERS.put("y", FLAG_UP | FLAG_LEFT | FLAG_DASH);
    LETTERS.put("j", FLAG_UP | FLAG_LEFT);

    LETTERS.put("w", FLAG_UP | FLAG_DASH);
    LETTERS.put("u", FLAG_UP);

    LETTERS.put("z", FLAG_UP | FLAG_RIGHT | FLAG_DASH);
    LETTERS.put("l", FLAG_UP | FLAG_RIGHT);

    // second row
    LETTERS.put("s", FLAG_LEFT | FLAG_DASH);
    LETTERS.put("d", FLAG_LEFT);

    LETTERS.put("b", FLAG_NULL | FLAG_DASH);
    LETTERS.put("o", FLAG_NULL);

    LETTERS.put("e", FLAG_RIGHT | FLAG_DASH);
    LETTERS.put("c", FLAG_RIGHT);

    // third row
    LETTERS.put("q", FLAG_DOWN | FLAG_LEFT | FLAG_DASH);
    LETTERS.put("g", FLAG_DOWN | FLAG_LEFT);

    LETTERS.put("m", FLAG_DOWN | FLAG_DASH);
    LETTERS.put("p", FLAG_DOWN);

    LETTERS.put("f", FLAG_DOWN | FLAG_RIGHT | FLAG_DASH);
    LETTERS.put("r", FLAG_DOWN | FLAG_RIGHT);


    // the eXceptions
    LETTERS.put(".", FLAG_X | FLAG_UP | FLAG_DASH);
    LETTERS.put("v", FLAG_X | FLAG_UP);

    // TODO: get unicode quotes?
    // LETTERS.put("", FLAG_X | FLAG_LEFT | FLAG_DASH);
    // > is empty as Q was moved to DOWN LEFT
    // LETTERS.put("q", FLAG_X | FLAG_LEFT);

    // LETTERS.put("", FLAG_X | FLAG_RIGHT | FLAG_DASH);
    LETTERS.put("k", FLAG_X | FLAG_RIGHT);

    LETTERS.put("n", FLAG_X | FLAG_DOWN | FLAG_DASH);
    LETTERS.put("a", FLAG_X | FLAG_DOWN);


    LETTERS.put("i", FLAG_UP | FLAG_LEFT | FLAG_DOWN);

    LETTERS.put("h", FLAG_UP | FLAG_LEFT | FLAG_RIGHT);

    LETTERS.put("x", FLAG_X);

    LETTERS.put("t", FLAG_X | FLAG_UP | FLAG_DOWN | FLAG_LEFT | FLAG_RIGHT);

    // experimental
    LETTERS.put(" ", FLAG_UP | FLAG_DOWN | FLAG_LEFT | FLAG_RIGHT);
}

// all bits in mask are set
boolean maskAll(int value, int mask) {
    return (value & mask) == mask;
}

// any bit in mask is set
boolean maskAny(int value, int mask) {
    return (value & mask) > 0;
}

// none of bits in mask are set
boolean maskNone(int value, int mask) {
    return (value & ~(value & mask)) == value;
}

void draw_shape(int flags, int posX, int posY, int sizeX, int sizeY, boolean dot) {
    stroke(255);
    strokeWeight(3);

    final int DASH_SIZE = 5; // TODO: this should also change depending on other parameters

    if (maskAll(flags, FLAG_X)) {
        if (maskNone(flags, FLAG_UP | FLAG_DOWN | FLAG_LEFT | FLAG_RIGHT)) {
            // X
            line(posX, posY, posX + sizeX, posY - sizeY);
            line(posX + sizeX, posY, posX, posY - sizeY);
        } else if (maskAll(flags, FLAG_UP | FLAG_DOWN | FLAG_LEFT | FLAG_RIGHT)) {
            // +
            line(posX, posY - sizeY/2, posX + sizeX, posY - sizeY/2);
            line(posX + sizeX/2, posY, posX + sizeX/2, posY - sizeY);
        } else if (maskAll(flags, FLAG_UP)) {
            // V
            line(posX + sizeX/2, posY, posX, posY - sizeY);
            line(posX + sizeX/2, posY, posX + sizeX, posY - sizeY);
        } else if (maskAll(flags, FLAG_DOWN)) {
            // A
            line(posX + sizeX/2, posY - sizeY, posX, posY);
            line(posX + sizeX/2, posY - sizeY, posX + sizeX, posY);
        } else if (maskAll(flags, FLAG_LEFT)) {
            // >
            line(posX + sizeX, posY - sizeY/2, posX, posY - sizeY);
            line(posX + sizeX, posY - sizeY/2, posX, posY);
        } else if (maskAll(flags, FLAG_RIGHT)) {
            // <
            line(posX, posY - sizeY/2, posX + sizeX, posY - sizeY);
            line(posX, posY - sizeY/2, posX + sizeX, posY);
        }

        // TODO: should these be double dash-able??
        if (maskAny(flags, FLAG_DOUBLE_DASH))
            point(posX + sizeX/2, posY - sizeY/2);
    } else {
        if (!maskAll(flags, FLAG_UP))
            line(posX, posY - sizeY, posX + sizeX, posY - sizeY);

        if (!maskAll(flags, FLAG_DOWN))
            line(posX, posY, posX + sizeX, posY);

        if (!maskAll(flags, FLAG_LEFT))
            line(posX, posY, posX, posY - sizeY);

        if (!maskAll(flags, FLAG_RIGHT))
            line(posX + sizeX, posY, posX + sizeX, posY - sizeY);

        // TODO double dashes
        // TODO prevent dashes on || and == shapes
        if (maskAll(flags, FLAG_DASH)) {
            if (dot)
                point(posX + sizeX/2, posY - sizeY/2);
            else {
                if (maskNone(flags, FLAG_LEFT | FLAG_RIGHT)) {
                    if (!maskAll(flags, FLAG_UP))
                        line(posX + sizeX/2, posY - sizeY + DASH_SIZE, posX + sizeX/2, posY - sizeY);
                    else if (!maskAll(flags, FLAG_DOWN))
                        line(posX + sizeX/2, posY - DASH_SIZE, posX + sizeX/2, posY);
                } else if (maskAll(flags, FLAG_LEFT))
                    line(posX + sizeX - DASH_SIZE, posY - sizeY/2, posX + sizeX, posY - sizeY/2);
                else if (maskAll(flags, FLAG_RIGHT))
                    line(posX + DASH_SIZE, posY - sizeY/2, posX, posY - sizeY/2);
            }
        }
    }
}

static Vector<Integer> letters = new Vector<Integer>();
static int flags = 0;

void fromHexExport(String export) {
    if (export.length() % 2 != 0) // todo error
        return;

    for (int i = 0; i < export.length(); i += 2)
        letters.add(unhex(export.substring(i, i + 2)));
}

void setup() {
    // hint(ENABLE_STROKE_PURE);
    size(800, 800);
    background(0, 0, 0);

    int posX = width/2;
    int posY = height/2;
    int sizeX = 50;
    int sizeY = 100;
    final int inc = 15;

    // draw_shape(LETTERS.get("n"), posX, posY, sizeX, sizeY, true);
    // sizeX += inc*2;
    // sizeY += inc*2;
    // posX -= inc;
    // posY += inc;
    // draw_shape(LETTERS.get("o"), posX, posY, sizeX, sizeY, false);
    // draw_shape(LETTERS.get("a"), posX + sizeX + inc, posY, sizeX/2, sizeY, false);
    // sizeX += inc*2 + sizeX/2 + inc;
    // sizeY += inc*2;
    // posX -= inc;
    // posY += inc;
    // draw_shape(LETTERS.get("s"), posX, posY, sizeX, sizeY, false);

    String input = "noas";
    for (int i = 0; i < s.length(); ++i) {
        Integer l = LETTERS.get(("" + s.charAt(i)).toLowerCase());
        if (l == null)
            println("l '" + s.charAt(i) + "' not found in database");
        else {
            // TODO dot on first
            if (maskAll(l, FLAG_X)) {
                draw_shape(l, posX, posY, sizeX + sizeX + inc, sizeY, false);
                sizeX += inc*2 + sizeX/2 + inc;
            } else {
                draw_shape(l, posX, posY, sizeX, sizeY, false);
                sizeX += inc*2;
                sizeY += inc*2;
                posX -= inc;
                posY += inc;
            }
        }
    }
    // String s = "JULDOCQPRYWZSBEGMF";
    // for (int i = 0; i < s.length(); ++i) {
    //     Integer ch = LETTERS.get(("" + s.charAt(i)).toLowerCase());
    //     if (ch == null)
    //         println("ch '" + s.charAt(i) + "' not found in database");
    //     else
    //         letters.add(ch);
    // }

    // draw_shape(LETTERS.get("a"), width/2, height/2, 50, 50);

    // fromHexExport("0A02120800100C04142A22322820302C2434");

    stroke(255, 0, 0);
    point(width/2, height/2);
}

void draw() {
    // background(102);

    // draw_shape(flags, width/2, height/2, 50, 100, false);
    // draw_shape(flags, width/2, height/2, 50, 50, false);
    // int size = 50;
    // boolean first = true;
    // for (int i : letters) {
    //     draw_shape(i, width/2, height/2, size, size, first);
    //     size += 15;

    //     if (first)
    //         first = false;
    // }
    // draw_shape(flags, width/2, height/2, size, size);

    // stroke(255, 0, 0);
    // point(width/2, height/2);
}

void keyPressed() {
    if (key == CODED) {
        if (keyCode == UP)
            flags |= FLAG_UP;

        if (keyCode == DOWN)
            flags |= FLAG_DOWN;

        if (keyCode == LEFT)
            flags |= FLAG_LEFT;

        if (keyCode == RIGHT)
            flags |= FLAG_RIGHT;
    }
}

void keyReleased() {
    if (key == CODED) {
        if (keyCode == UP)
            flags &= ~(FLAG_UP);

        if (keyCode == DOWN)
            flags &= ~(FLAG_DOWN);

        if (keyCode == LEFT)
            flags &= ~(FLAG_LEFT);

        if (keyCode == RIGHT)
            flags &= ~(FLAG_RIGHT);
    } else {
        if (key == 'd') {
            if (maskAll(flags, FLAG_DOUBLE_DASH))
                flags &= ~(FLAG_DOUBLE_DASH);
            else if (maskAll(flags, FLAG_DASH))
                flags |= FLAG_DOUBLE_DASH;
            else
                flags |= FLAG_DASH;
        }

        if (key == 'x')
            flags ^= FLAG_X;
    }

    if (key == ENTER) {
        letters.add(flags);
        // flags = 0;
    }

    if (key == BACKSPACE && letters.size() != 0)
        letters.remove(letters.size() - 1);

    // adds multiple spaces
    if (key == ' ') {
        for (int i = 0; i < 4; ++i)
            letters.add(FLAG_UP | FLAG_DOWN | FLAG_LEFT | FLAG_RIGHT);
    }

    if (key == 'p') {
        print("Current flags: ");
        print(binary(flags, 6));
        print(" (");
        print(hex(flags, 2));
        println(")");
    }

    if (key == 's')
        save("screen-" + millis() + ".jpeg");

    if (key == 'q') {
        String output = "";
        for (int i : letters)
            output += hex(i, 2);

        println("Hex export: " + output);
    }
}
