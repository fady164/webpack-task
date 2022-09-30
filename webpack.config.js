const pathModule = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

module.exports = {
   mode: "development",
   entry: "./src/index.js",
   output: {
      filename: "script.boundle.js",
      path: pathModule.resolve(__dirname, "dist"),
      assetModuleFilename: "imgs/[name][ext]",
   },
   module: {
      rules: [
         {
            //css
            test: /\.css$/i,
            use: [MiniCssExtractPlugin.loader, "css-loader"],
         },
         //imgs
         {
            test: /\.(png|svg|jpg|jpeg|gif)$/i,
            type: "asset/resource",
         },
         //sass
         {
            test: /\.s[ac]ss$/i,
            use: [
               // Creates `loader` nodes from JS strings
               MiniCssExtractPlugin.loader,
               // Translates CSS into CommonJS
               "css-loader",
               // Compiles Sass to CSS
               "sass-loader",
            ],
         },
      ],
   },
   plugins: [
      new HtmlWebpackPlugin(),
      new MiniCssExtractPlugin({ filename: "style.min.css" }),
   ],
   optimization: {
      minimizer: [
         // For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`), uncomment the next line
         `...`,
         new CssMinimizerPlugin(),
         new ImageMinimizerPlugin({
            minimizer: {
               implementation: ImageMinimizerPlugin.imageminMinify,
               options: {
                  // Lossless optimization with custom option
                  // Feel free to experiment with options for better result for you
                  plugins: [
                     ["gifsicle", { interlaced: true }],
                     ["mozjpeg", { quality: 75 }],
                     ["optipng", { optimizationLevel: 5 }],
                     // Svgo configuration here https://github.com/svg/svgo#configuration
                     [
                        "svgo",
                        {
                           plugins: [
                              {
                                 name: "preset-default",
                                 params: {
                                    overrides: {
                                       removeViewBox: false,
                                       addAttributesToSVGElement: {
                                          params: {
                                             attributes: [
                                                {
                                                   xmlns: "http://www.w3.org/2000/svg",
                                                },
                                             ],
                                          },
                                       },
                                    },
                                 },
                              },
                           ],
                        },
                     ],
                  ],
               },
            },
         }),
      ],
   },
};
