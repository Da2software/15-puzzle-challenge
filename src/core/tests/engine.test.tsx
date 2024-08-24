import { BoxParts, IPosition2D, MoveSystem } from "../engine"

test('Engine Test', () => {
    const size = 4;
    const boxparts = new BoxParts(size);
    const moveSys = new MoveSystem(boxparts);
    expect(boxparts.area).toStrictEqual([]);
    // if shuffle works
    boxparts.build();
    const progress = boxparts.getProgress();
    expect(progress).toBeLessThan(1);
    // check if zero exist
    const zeroPos = boxparts.findZero();
    expect(!!zeroPos).toStrictEqual(true);
    // check if move works
    const targetPos: IPosition2D = boxparts.getRandomMove(zeroPos);
    moveSys.setSelected(targetPos);
    expect(moveSys.move(zeroPos)).toBe(true);
    expect(boxparts.area[targetPos.y][targetPos.x]).toStrictEqual(0);
})