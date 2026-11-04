'use client';

import { useState } from 'react';

interface Props {
  hotline?: string;
  companyName?: string;
}

export default function ShrinkFilmCalculator({
  hotline = '0907 616 611',
  companyName = 'chúng tôi',
}: Props) {
  const [shape, setShape] = useState<'box' | 'round'>('box');
  const [length, setLength] = useState<string>('20');
  const [width, setWidth] = useState<string>('12');
  const [height, setHeight] = useState<string>('8');
  const [diameter, setDiameter] = useState<string>('6.5');
  const [roundHeight, setRoundHeight] = useState<string>('4');
  const [calculated, setCalculated] = useState<boolean>(true);

  const cleanPhone = hotline.replace(/\s|\./g, '');

  let flatCm = 0;
  let cutLenCm = 0;

  if (shape === 'box') {
    const l = parseFloat(length.replace(',', '.')) || 0;
    const w = parseFloat(width.replace(',', '.')) || 0;
    const h = parseFloat(height.replace(',', '.')) || 0;
    flatCm = Math.round((w + h) * 1.1 * 10) / 10;
    cutLenCm = Math.round((l + h) * 1.1 * 10) / 10;
  } else {
    const d = parseFloat(diameter.replace(',', '.')) || 0;
    const hr = parseFloat(roundHeight.replace(',', '.')) || 0;
    flatCm = Math.round(((Math.PI * d) / 2) * 1.05 * 10) / 10;
    cutLenCm = Math.round((hr + 1) * 10) / 10;
  }

  function handleCalculate(e: React.FormEvent) {
    e.preventDefault();
    setCalculated(true);
  }

  return (
    <div className="mcvt-wrap mcvt-calc" suppressHydrationWarning>
      <div className="mcvt-calc__intro">
        <p className="mcvt-eyebrow">Công cụ</p>
        <h2 id="mcvt-calc-h">Ước tính khổ màng co cho sản phẩm</h2>
        <p>
          Nhập kích thước sản phẩm để có khổ màng (lay-flat) tham khảo. Kết quả
          là ước tính – {companyName} sẽ xác nhận lại quy cách chính xác khi báo
          giá.
        </p>
        <a className="mcvt-btn mcvt-btn--ghost" href={`tel:${cleanPhone}`}>
          Cần tư vấn? Gọi {hotline}
        </a>
      </div>

      <form
        className="mcvt-calc__box"
        id="mcvt-calc"
        onSubmit={handleCalculate}
        noValidate
        suppressHydrationWarning
      >
        <fieldset className="mcvt-calc__type">
          <legend>Hình dạng sản phẩm</legend>
          <label
            className={shape === 'box' ? 'is-checked' : ''}
            onClick={() => setShape('box')}
          >
            <input
              suppressHydrationWarning
              type="radio"
              name="shape"
              value="box"
              checked={shape === 'box'}
              onChange={() => setShape('box')}
            />{' '}
            Hộp / khối chữ nhật
          </label>
          <label
            className={shape === 'round' ? 'is-checked' : ''}
            onClick={() => setShape('round')}
          >
            <input
              suppressHydrationWarning
              type="radio"
              name="shape"
              value="round"
              checked={shape === 'round'}
              onChange={() => setShape('round')}
            />{' '}
            Chai / lọ tròn
          </label>
        </fieldset>

        {shape === 'box' ? (
          <div className="mcvt-calc__fields" data-shape="box">
            <label>
              Dài (cm)
              <input
                suppressHydrationWarning
                type="number"
                inputMode="decimal"
                min="0"
                step="0.1"
                name="l"
                placeholder="vd 20"
                value={length}
                onChange={(e) => setLength(e.target.value)}
              />
            </label>
            <label>
              Rộng (cm)
              <input
                suppressHydrationWarning
                type="number"
                inputMode="decimal"
                min="0"
                step="0.1"
                name="w"
                placeholder="vd 12"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
              />
            </label>
            <label>
              Cao (cm)
              <input
                suppressHydrationWarning
                type="number"
                inputMode="decimal"
                min="0"
                step="0.1"
                name="h"
                placeholder="vd 8"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
              />
            </label>
          </div>
        ) : (
          <div className="mcvt-calc__fields" data-shape="round">
            <label>
              Đường kính lớn nhất (cm)
              <input
                suppressHydrationWarning
                type="number"
                inputMode="decimal"
                min="0"
                step="0.1"
                name="d"
                placeholder="vd 6.5"
                value={diameter}
                onChange={(e) => setDiameter(e.target.value)}
              />
            </label>
            <label>
              Chiều cao phần cần bọc (cm)
              <input
                suppressHydrationWarning
                type="number"
                inputMode="decimal"
                min="0"
                step="0.1"
                name="hr"
                placeholder="vd 4"
                value={roundHeight}
                onChange={(e) => setRoundHeight(e.target.value)}
              />
            </label>
          </div>
        )}

        <button
          suppressHydrationWarning
          type="submit"
          className="mcvt-btn mcvt-btn--primary"
        >
          Tính khổ màng
        </button>

        {calculated && (
          <div className="mcvt-calc__result" aria-live="polite">
            <p>
              Khổ màng gợi ý:{' '}
              <strong data-out="flat">
                khoảng {flatCm.toLocaleString('vi-VN')} cm (~
                {Math.round(flatCm * 10)} mm)
              </strong>
            </p>
            <p>
              Chiều dài cắt/đoạn gợi ý:{' '}
              <strong data-out="len">
                khoảng {cutLenCm.toLocaleString('vi-VN')} cm (~
                {Math.round(cutLenCm * 10)} mm)
              </strong>
            </p>
            <a className="mcvt-link" href="#bao-gia">
              Gửi quy cách này để nhận báo giá →
            </a>
          </div>
        )}
      </form>
    </div>
  );
}
