function isDarkColor(hexColor: string) {
    // hex 코드를 RGB 값으로 변환
    const rgb = hexToRgb(hexColor)

    // 밝기 계산
    const brightness = (rgb.r + rgb.g + rgb.b) / 3

    // 밝기 기준 값 설정 (예: 128)
    const threshold = 128

    // 밝기가 기준 값 미만이면 어두운 색으로 판단
    return brightness < threshold
}

function hexToRgb(hex: string) {
    // hex 코드에서 '#' 제거
    hex = hex.replace('#', '')

    // 16진수 숫자를 두 자리씩 잘라서 배열에 저장
    const bigint = parseInt(hex, 16)
    const r = (bigint >> 16) & 255
    const g = (bigint >> 8) & 255
    const b = bigint & 255

    // RGB 객체 생성
    return { r, g, b }
}

export default {
    isDarkColor,
    hexToRgb
}
