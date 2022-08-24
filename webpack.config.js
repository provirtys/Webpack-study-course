//подключение плагинов
const path = require('path')

//автоматическое подключение скриптов
const HtmlWebpackPlugin = require('html-webpack-plugin')

//очищение папки dist
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

//копирование файлов в dist
const CopyWebpackPlugin = require('copy-webpack-plugin')

//хранение стилей не в head, а в отдельном файле
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

//минификация файлов css
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin')

//еще одна минификация файлов (возможно не только css)
const TerserWebpackPlugin = require('terser-webpack-plugin')
const { css } = require('jquery')

//линт
const EslintWebpackPlugin = require('eslint-webpack-plugin')

//крутая инфографика по плагинам
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer')

const isDev = process.env.NODE_ENV === 'development'
const isProd = !isDev

const optimization = () => {
  const config = {
    //загрузка библиотек 1 раз
    splitChunks: {
      chunks: 'all',
    },
  }

  if (isProd) {
    config.minimizer = [
      new CssMinimizerWebpackPlugin(),
      new TerserWebpackPlugin(),
    ]
  }

  return config
}

const filename = (ext) =>
  isDev ? `[name].${ext}` : `[name].[contenthash].${ext}`

const cssUse = (loader) => {
  const config = [
    {
      loader: MiniCssExtractPlugin.loader,
    },
    'css-loader',
  ]
  if (loader) {
    config.push(loader)
  }
  return config
}

const babelOptions = (preset) => {
  const config = {
    presets: ['@babel/preset-env'],
  }

  if (preset) {
    config.presets.push(preset)
  }

  return config
}

const jsLoaders = () => {
  const config = [
    {
      loader: 'babel-loader',
      options: babelOptions(),
    },
  ]

  if (isDev) {
    config.push('eslint-loader')
  }
  return config
}

const plugins = () => {
  const base = [
    new HtmlWebpackPlugin({
      template: './index.html',

      //минификация файлов html,css... (тут когда продакшн)
      minify: {
        collapseWhitespace: isProd,
      },
    }),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/favicon.ico'),
          to: path.resolve(__dirname, 'dist'),
        },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: filename('css'),
    }),
    new EslintWebpackPlugin({
      extensions: ['js'],
    }),
  ]
  if(isProd){
    base.push(new BundleAnalyzerPlugin())
  }

  return base
}

module.exports = {
  context: path.resolve(__dirname, 'src'),

  //режим по умолчанию
  mode: 'development',

  //несвязанные js файлы для подключения (точки входа)
  entry: {
    main: './index.jsx',
    analytics: './analytics.ts',
  },

  //куда загружать конечные файлы (включая паттерны - name, contenthash...)
  output: {
    filename: filename('js'),
    path: path.resolve(__dirname, 'dist'),
  },

  //плагины
  plugins: plugins(),

  //правила загрузки разных файлов
  module: {
    rules: [
      {
        test: /\.(png|jpg|svg|gif)$/,
        type: 'asset/resource',
      },
      {
        test: /\.xml$/,
        use: 'xml-loader',
      },
      {
        test: /\.css$/,
        use: cssUse(),
      },
      {
        test: /\.csv$/,
        use: 'csv-loader',
      },
      {
        test: /\.less$/,
        use: cssUse('less-loader'),
      },
      {
        test: /\.s[ac]ss$/,
        use: cssUse('sass-loader'),
      },
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: babelOptions(),
        },
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: babelOptions('@babel/preset-typescript'),
        },
      },
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: babelOptions('@babel/preset-react'),
        },
      },
    ],
  },

  resolve: {
    //расширения файлов, которые стоит искать по умолчанию (image.png -> image)
    extensions: ['.js', '.json', '.png'],

    //синонимы для директорий
    alias: {
      '@models': path.resolve(__dirname, 'src/models'),
      '@': path.resolve(__dirname, 'src/'),
    },
  },

  //оптимизация
  optimization: optimization(),

  //live server
  devServer: {
    static: './',
    port: 4200,
  },

  //исходные карты и т.д. (браузер показывает исходный код включая источники стилей - css,less,sass)
  devtool: isDev ? 'source-map' : false,
}
