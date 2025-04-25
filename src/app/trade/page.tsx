'use client';
import {useRef, useState, useEffect, Key} from 'react';
import {init, dispose, Chart, KLineData} from 'klinecharts';
import {Spinner, Select, SelectItem, Tabs, Tab, SharedSelection} from '@heroui/react'
import clsx from "clsx";

interface DataItem {
  [key: string]: string;
}

const mainIndicators = ['MA', 'EMA', 'BOLL'];
const indicatorList = [
  {key: 'MA', label: 'MA'},
  {key: 'EMA', label: 'EMA'},
  {key: 'BOLL', label: 'BOLL'},
  {key: 'VOL', label: 'VOL'},
  {key: 'MACD', label: 'MACD'},
  {key: 'KDJ', label: 'KDJ'},
  {key: 'RSI', label: 'RSI'},
];
const periodList = [
  {key: '1m', label: '1m'},
  {key: '5m', label: '5m'},
  {key: '15m', label: '15m'},
  {key: '30m', label: '30m'},
  {key: '1h', label: '1h'},
  {key: '4h', label: '4h'},
  {key: '1d', label: 'Daily line'},
  {key: '1w', label: 'Perimeter'},
];

export default function Trade() {
  const chart = useRef<Chart>(null);
  const [h, setH] = useState(600)
  const [loading, setLoading] = useState(false);
  const [period, setPeriod] = useState<string>('15m');
  const [currentPrice, setCurrentPrice] = useState('');
  const [priceChange, setPriceChange] = useState(0);
  const [price, setPrice] = useState('');
  const [indicator, setIndicator] = useState(new Set(['MA', 'VOL']));

  const handlePeriodChange = (e: Key) => {
    setPeriod(e as string);
    timer.current && clearTimeout(timer.current);
    loadKlineData(e as string)
  };

  const handleIndicatorChange = (keys: SharedSelection) => {
    const ks = Array.from(keys) as string[];
    const currentKey = keys?.currentKey ?? '';
    if (currentKey && ks.includes(currentKey)) {
      if (mainIndicators.includes(currentKey)) {
        chart.current?.createIndicator(currentKey, false, { id: 'candle_pane' });
        const arr = ks.filter((d) => !mainIndicators.includes(d));
        return setIndicator(new Set([...arr, currentKey]));
      } else {
        chart.current?.createIndicator(currentKey, true);
      }
    } else {
      const ir = Array.from(indicator) as string[];
      const diff = ir.filter(d => !ks.includes(d));
      chart.current?.removeIndicator({name: diff[0]});
    }
    if (!ks.length) {
      chart.current?.createIndicator('MA', false, { id: 'candle_pane' });
      return setIndicator(new Set(['MA']));
    }
    setIndicator(new Set(ks));
  };

  const timer = useRef<NodeJS.Timeout | null>(null);
  const refreshLoadData = () => {
    timer.current = setTimeout(() => loadKlineData(), 60000);
  }
  const loadKlineData = async (interval?: string) => {
    try {
      setLoading(true);

      // 使用Binance API获取BTC/USDT的K线数据
      const response = await fetch(`https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=${interval || period}&limit=500`);
      const data = await response.json() as DataItem[];

      // 格式化数据
      const klineData = data.map((item) => ({
        timestamp: Number(item[0]), // 开盘时间
        open: parseFloat(item[1]),
        high: parseFloat(item[2]),
        low: parseFloat(item[3]),
        close: parseFloat(item[4]),
        volume: parseFloat(item[5]),
      })) as KLineData[];

      // 设置图表数据
      chart.current?.applyNewData(klineData);

      // 更新当前价格和涨跌幅
      if (klineData.length) {
        const latestData = klineData[klineData.length - 1];
        const previousData = klineData[klineData.length - 2];

        const currentPrice = latestData.close;
        const priceChange = currentPrice - previousData.close;
        const priceChangePercent = (priceChange / previousData.close) * 100;

        setCurrentPrice(currentPrice.toFixed(2))

        setPriceChange(priceChange)
        setPrice(`${priceChange >= 0 ? '+' : ''}${priceChange.toFixed(2)} (${priceChangePercent >= 0 ? '+' : ''}${priceChangePercent.toFixed(2)}%)`);
      }

      refreshLoadData();
    } catch (error) {
      console.error('获取K线数据失败:', error);
    } finally {
      setLoading(false);
    }
  }

  const initChart = () => {
    // 创建图表实例
    chart.current = init('chart');

    // 创建主图技术指标
    chart.current?.createIndicator('MA', false, {id: 'candle_pane'});

    // 添加成交量图表
    chart.current?.createIndicator('VOL', true);

    // 加载数据
    loadKlineData(period);
  }

  const handleHeightChange = () => {
    const contentH = document.documentElement.clientHeight - ((document.querySelector('#qc-header') as HTMLHeadElement)?.clientHeight ?? 0) - 140;
    setH(contentH);
  }
  const timerHeight = useRef<NodeJS.Timeout | null>(null);
  const resizeChart = () => {
    timerHeight.current && clearTimeout(timerHeight.current);
    timerHeight.current = setTimeout(() => {
      handleHeightChange();
      chart.current?.resize()
    }, 100)
  }

  useEffect(() => {
    handleHeightChange();
    setTimeout(initChart);
    window.addEventListener('resize', resizeChart);

    return () => {
      timer.current && clearTimeout(timer.current);
      dispose('chart');
      window.removeEventListener('resize', resizeChart);
    }
  }, []);

  return (
    <div className="py-5 px-10 w-full">
      <div className="w-full">
        <div className="flex items-center gap-5">
          <span className="text-xl">BTC/USDT</span>
          <div className="flex items-center gap-2">
            <span className="text-md">{currentPrice}</span>
            <span className={clsx(
              'text-md',
              priceChange >= 0 ? 'text-green-500' : 'text-red-500'
            )}>{price}</span>
          </div>
        </div>
        <div className="flex items-center justify-between w-full my-4">
          <Tabs
            aria-label="periodList"
            selectedKey={period}
            onSelectionChange={handlePeriodChange}
          >
            {periodList.map(item => (
              <Tab key={item.key} title={item.label}/>
            ))}
          </Tabs>
          <Select
            aria-label="indicatorList"
            className="w-1/3"
            variant="bordered"
            selectionMode="multiple"
            selectedKeys={indicator}
            placeholder="Add technical indicators"
            onSelectionChange={handleIndicatorChange}
          >
            {indicatorList.map(item => (
              <SelectItem key={item.key}>{item.label}</SelectItem>
            ))}
          </Select>
        </div>
      </div>
      <div className="relative w-full">
        <div id="chart" className="w-full" style={{height: `${h}px`}}></div>
        {loading && <div className="absolute left-1/2 top-1/2 translate-x-1/2 translate-y-1/2"><Spinner color="default" /></div>}
      </div>
    </div>
  )
}
