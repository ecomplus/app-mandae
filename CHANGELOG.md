# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [1.8.0](https://github.com/ecomplus/application-starter/compare/v1.7.0...v1.8.0) (2025-04-23)


### Features

* add `min_kg_weight` filter option on shipping rules ([9692b15](https://github.com/ecomplus/application-starter/commit/9692b155487f886a82c4bd09d92dd87cd325c1e7))

## [1.7.0](https://github.com/ecomplus/application-starter/compare/v1.6.0...v1.7.0) (2025-03-20)


### Features

* new option to hardset package weight up to 50kg (mandae limit) ([4bc6b43](https://github.com/ecomplus/application-starter/commit/4bc6b43e80a9119544687ee421b868be3caf3551))


### Bug Fixes

* fix checking rules max weight ([da4fd6d](https://github.com/ecomplus/application-starter/commit/da4fd6d28d7579c7c8458436fb3bdd3506bb15a4))

## [1.6.0](https://github.com/ecomplus/application-starter/compare/v1.5.1...v1.6.0) (2025-03-13)


### Features

* add `max_kg_weight` filter option on shipping rules ([3cfc5aa](https://github.com/ecomplus/application-starter/commit/3cfc5aa1e68e0ffc1bbf43be03232cef9c83686c))

### [1.5.1](https://github.com/ecomplus/application-starter/compare/v1.5.0...v1.5.1) (2025-03-08)

## [1.5.0](https://github.com/ecomplus/application-starter/compare/v1.4.0...v1.5.0) (2025-03-08)


### Features

* **calculate-shipping:** use bigger box as calculate option ([40cd424](https://github.com/ecomplus/application-starter/commit/40cd424c536dec812bdeb764212aea306ec01ed0))
* **ecom-config:** set option to fix value in shipping rule ([580ee1a](https://github.com/ecomplus/application-starter/commit/580ee1a7e59bb4f8f03a83ba478124d04ee2afe4))
* **route:** set route to mandae tracking ([9180c40](https://github.com/ecomplus/application-starter/commit/9180c40b66a6e6b011ea4605e4eccf3353b4478f))
* update check tracking cron to re-export orders when tracking id (invoice) is changed ([4374571](https://github.com/ecomplus/application-starter/commit/4374571d9a8ba9e8b7322b9f25dec0d6d7b304e7))


### Bug Fixes

* also removing mandae webhook endpoint in favor of cron tracking ([2a0545b](https://github.com/ecomplus/application-starter/commit/2a0545bd3fa9b22a384fec73e12db2444db08d0e))
* better debugging order export errors ([a457b29](https://github.com/ecomplus/application-starter/commit/a457b294a1d335b7c1ecba88a7abd133563b7cbd))
* cleaning config options and edge cases on warehouses implementation ([31e9b0b](https://github.com/ecomplus/application-starter/commit/31e9b0b2c24168dc646c68ec39ca1138e7f9bc7d))
* **deps:** update all non-major ([9567c54](https://github.com/ecomplus/application-starter/commit/9567c5473980d4b05b9bd698caf5b5c3254dea04))
* **deps:** update all non-major ([#65](https://github.com/ecomplus/application-starter/issues/65)) ([254a85f](https://github.com/ecomplus/application-starter/commit/254a85f2cfb8a8d1728f01ccf23c6685ab11d2fe))
* **deps:** update all non-major ([#67](https://github.com/ecomplus/application-starter/issues/67)) ([2d59cc5](https://github.com/ecomplus/application-starter/commit/2d59cc5059a06c420a1624769ca31d5eba0ee429))
* **deps:** update dependency dotenv to ^16.3.1 ([57bf30b](https://github.com/ecomplus/application-starter/commit/57bf30ba2513a81691c60d00d26db9c9c1b3e6bd))
* **deps:** update dependency dotenv to ^16.4.1 ([b3be090](https://github.com/ecomplus/application-starter/commit/b3be090f574ea6a7de50df582e9304aebced07e5))
* **deps:** update firebase-tools to v11 ([e461a0c](https://github.com/ecomplus/application-starter/commit/e461a0cf0a3ab857f1d1bf78a8605b2122281fca))
* do not fail order export on tag already created by id ([5e860e1](https://github.com/ecomplus/application-starter/commit/5e860e16edae8e1ddd37acd0de4396905c2ff0e6))
* double check already saved tracking code on current order ([943ebf5](https://github.com/ecomplus/application-starter/commit/943ebf54cf775f927fbe1a78aab4fd3f791c4075))
* export order with address borough "Centro" as default value if undefined ([ddd750e](https://github.com/ecomplus/application-starter/commit/ddd750e416d241718cc5e5ee0469752d4ceacc82))
* fix calculate shipping with configured warehouses (check zip range) ([83db61d](https://github.com/ecomplus/application-starter/commit/83db61d8837a61de925c523e099717d8736e4782))
* fix data updating shipping line on order export ([0b94cc0](https://github.com/ecomplus/application-starter/commit/0b94cc01071f65b85c63ded598c4b878bc5b4766))
* format carrier doc number ([39185c2](https://github.com/ecomplus/application-starter/commit/39185c25d3f106c87095565742beb5d0e79088a2))
* list stores from auths up to 48h ([62ba933](https://github.com/ecomplus/application-starter/commit/62ba9330de13adbf817330a26aacab2934043343))
* list stores from auths up to 48h ([a115df6](https://github.com/ecomplus/application-starter/commit/a115df61c0074174e210f95da7b410ec705d78da))
* parsing additional mandae status to `returned` ([7ee83d2](https://github.com/ecomplus/application-starter/commit/7ee83d27dd9b4b7c71421a3f1280d42a98d535f6))
* prevent interrumpting orders export queue with some invalid body ([5ebf1c8](https://github.com/ecomplus/application-starter/commit/5ebf1c80f6ec848c90e21448495258003b9bde0d))
* prevent interrumpting orders status import with some 404 ([2c41ad6](https://github.com/ecomplus/application-starter/commit/2c41ad66513f3025e6da193d322e7f2b80334977))
* prevent running orders tracking for unecessary stores (require tracking prefix) ([1361fae](https://github.com/ecomplus/application-starter/commit/1361fae1ecf9c83c804c8bd11b9c9fadf13db02f))
* properly sending waiting orders to mandae ([85cdeda](https://github.com/ecomplus/application-starter/commit/85cdedaf4d04cf26b72a512fb2002ef3aac9e372))
* refactored check orders tracking routine ([1580b36](https://github.com/ecomplus/application-starter/commit/1580b362542038e649b108dec852ab7420fd62c1))
* run orders tracking and taging twice an hour, swap orders list sort order each execution ([d681e31](https://github.com/ecomplus/application-starter/commit/d681e319d87c768af7dff4eaef928f31ab832d71))
* stop considering "Encomenda coletada" as shipped on status import ([44e5526](https://github.com/ecomplus/application-starter/commit/44e55268126616514b65c1094924244ba465ce49))
* **tracking-code:** request response with apropriate treatment ([0e04530](https://github.com/ecomplus/application-starter/commit/0e045302a537ee06a4622936b36e841cab8c7183))
* **tracking-codes:** set right requested url to get specific invoice ([664cdf4](https://github.com/ecomplus/application-starter/commit/664cdf496d307fabe4c8b20fee79b2a4e91f258f))
* trim order invoice numbers to tracking id ([afecc8c](https://github.com/ecomplus/application-starter/commit/afecc8c7c022e17adc7463a32bc1b7514688d75a))
* **update-tracking:** cronjob with fixed array result ([446fb2c](https://github.com/ecomplus/application-starter/commit/446fb2cea81ebc8104fd3d360900394c973db3c0))
* using tracking code object tag to prevent resending orders ([d299d0a](https://github.com/ecomplus/application-starter/commit/d299d0ab110e21bef8ff324ad85a68540f2d26b7))

## [1.4.0](https://github.com/ecomplus/application-starter/compare/v1.3.1...v1.4.0) (2023-09-08)


### Features

* new optional carrier name and doc config per service ([550c925](https://github.com/ecomplus/application-starter/commit/550c925fa19295938c093a43887fa3ab986efbc7))

### [1.3.1](https://github.com/ecomplus/application-starter/compare/v1.3.0...v1.3.1) (2023-09-05)


### Bug Fixes

* **calculate-shipping:** do not insert additional value on free shipping rule ([#45](https://github.com/ecomplus/application-starter/issues/45)) ([3f9bd51](https://github.com/ecomplus/application-starter/commit/3f9bd513dc5ed63295c3943f8351e3b7514fed7a))
* **calculate-shipping:** return shipping services with `service_code` ([#39](https://github.com/ecomplus/application-starter/issues/39)) [[#40](https://github.com/ecomplus/application-starter/issues/40)] ([3142eea](https://github.com/ecomplus/application-starter/commit/3142eeab69e2fd23a2757d117cfb5c3330d5554b))
* **calculate-shipping:** use ecomutils to get correct price ([b282803](https://github.com/ecomplus/application-starter/commit/b282803a83e9473fa98bb6440a7a5aa92476f597))
* **deps:** update all non-major ([a7a4275](https://github.com/ecomplus/application-starter/commit/a7a427535f8a185fb69bd9bb32d3726d183dd437))
* **deps:** update all non-major ([9b7b5f1](https://github.com/ecomplus/application-starter/commit/9b7b5f1b9aeaf342f060758175be9c8df83d6e9c))
* **deps:** update all non-major ([115a50d](https://github.com/ecomplus/application-starter/commit/115a50d2ae79fa1faabac203a46c7de1e78c63b9))
* **deps:** update all non-major ([b1b78b3](https://github.com/ecomplus/application-starter/commit/b1b78b33d720fddfcf19151b38cb6a290264c16a))
* **deps:** update all non-major ([32cfe02](https://github.com/ecomplus/application-starter/commit/32cfe02b3a953ac7a79a3791fe8c4cad66ae1e71))
* **deps:** update dependency dotenv to ^16.1.3 ([3f2a3ff](https://github.com/ecomplus/application-starter/commit/3f2a3ff9d6af347bf85f0d792b92a77ab9c38a93))

## [1.3.0](https://github.com/ecomplus/application-starter/compare/v1.2.0...v1.3.0) (2022-03-14)


### Features

* **admin-settings:** add posting deadline ([#23](https://github.com/ecomplus/application-starter/issues/23)) ([918ea4c](https://github.com/ecomplus/application-starter/commit/918ea4cf7e134a7292319eae98c7fdc9438a55ae))


### Bug Fixes

* **calculate-shipping:** must return full shipping address ([#4](https://github.com/ecomplus/application-starter/issues/4)) ([e213850](https://github.com/ecomplus/application-starter/commit/e2138503198176200fea1ca3523acd1231470370))
* **deps:** update @ecomplus/application-sdk to v1.15.5 firestore ([f9c4c9d](https://github.com/ecomplus/application-starter/commit/f9c4c9dd704ab85fe5542a37cc810dee8fe8e3b5))
* **deps:** update all non-major ([80d3b66](https://github.com/ecomplus/application-starter/commit/80d3b66966d371ad07c099736dc0f8c7f341f1a4))
* **deps:** update all non-major ([15afa6c](https://github.com/ecomplus/application-starter/commit/15afa6c9880e07c920ce0b720ea8bd48ef14a526))
* **deps:** update all non-major ([70ada42](https://github.com/ecomplus/application-starter/commit/70ada42a4babd6d614d8ea63e41d3fe478789b55))
* **deps:** update all non-major ([b2829b9](https://github.com/ecomplus/application-starter/commit/b2829b93e2700a5b7968200be2e1d02d29e8bc69))
* **deps:** update dependency @ecomplus/application-sdk to ^22.0.0-firestore.1.15.6 ([b5fcb5b](https://github.com/ecomplus/application-starter/commit/b5fcb5b4101e51ba0090044b37f0dffd8122c914))
* **deps:** update dependency dotenv to v16 ([#26](https://github.com/ecomplus/application-starter/issues/26)) [skip ci] ([7f78743](https://github.com/ecomplus/application-starter/commit/7f787439b774344b28d3937f3128fcc27c4da725))
* **deps:** update dependency firebase-admin to v10 ([#14](https://github.com/ecomplus/application-starter/issues/14)) [skip ci] ([6dbd289](https://github.com/ecomplus/application-starter/commit/6dbd2898a12d55a6d25200224767ebb8f381f5bd))
* **deps:** update dependency firebase-functions to ^3.15.5 ([36258f8](https://github.com/ecomplus/application-starter/commit/36258f8733c721479092fb5dd73f7e46d59918d9))
* **deps:** update dependency firebase-tools to ^9.17.0 ([c3ce0e6](https://github.com/ecomplus/application-starter/commit/c3ce0e6096dc0c809ea61d191f2c512badbaebec))
* **deps:** update dependency uglify-js to ^3.14.3 ([3cd1111](https://github.com/ecomplus/application-starter/commit/3cd1111c913c10c1a148f9a848cec5d2517913be))
* **deps:** update dependency uglify-js to ^3.15.0 ([954f11b](https://github.com/ecomplus/application-starter/commit/954f11b15cabad688e1e913990ada59fc3461547))

## [1.2.0](https://github.com/ecomplus/application-starter/compare/v1.1.0...v1.2.0) (2021-08-03)


### Features

* **calculate-shipping:** handle new fixed additional price option [[#1](https://github.com/ecomplus/application-starter/issues/1)] ([1ed8b5d](https://github.com/ecomplus/application-starter/commit/1ed8b5da8c5a6c03ac079653fbc235e763dff585))

## [1.1.0](https://github.com/ecomplus/application-starter/compare/v1.0.0...v1.1.0) (2021-08-02)


### Features

* **calculate-shipping:** handle discount with percentage from subtotal [[#1](https://github.com/ecomplus/application-starter/issues/1)] ([95061b3](https://github.com/ecomplus/application-starter/commit/95061b36effe670ee9ee7f9d166d4c96d15d3b43))


### Bug Fixes

* **calculate-shipping:** must set subtotal with sum of price * quantity ([609d5b7](https://github.com/ecomplus/application-starter/commit/609d5b7995ef648c27354429b51316ed34f9a3c1))

## 1.0.0 (2021-07-27)

## [1.0.0-starter.24](https://github.com/ecomplus/application-starter/compare/v1.0.0-starter.23...v1.0.0-starter.24) (2021-06-24)


### Bug Fixes

* **deps:** update functions non-major dependencies ([dca0a11](https://github.com/ecomplus/application-starter/commit/dca0a113a2da8ae29054d1f4809b83518051cd68))
* **webhooks:** handle auth not found error to prevent webhook retries ([5082a7d](https://github.com/ecomplus/application-starter/commit/5082a7d0a0c5fe53b9529553c14f7e7be16ebf1f))

## [1.0.0-starter.23](https://github.com/ecomplus/application-starter/compare/v1.0.0-starter.22...v1.0.0-starter.23) (2021-06-15)


### Bug Fixes

* **deps:** update @ecomplus/application-sdk to v1.14.11 ([c7d8cd0](https://github.com/ecomplus/application-starter/commit/c7d8cd021dba0a9b477e234c97e1702f140a8aa8))
* **deps:** update dependency dotenv to v10 ([#90](https://github.com/ecomplus/application-starter/issues/90)) ([47104be](https://github.com/ecomplus/application-starter/commit/47104bef16fd9bb89979d86af709948f156b05a1))

## [1.0.0-starter.22](https://github.com/ecomplus/application-starter/compare/v1.0.0-starter.21...v1.0.0-starter.22) (2021-05-07)


### Bug Fixes

* **deps:** update @ecomplus/application-sdk to v1.14.10 ([c6f25f2](https://github.com/ecomplus/application-starter/commit/c6f25f233b1870fd27240582ebb080217d59d847))
* **env:** try FIREBASE_CONFIG json when GCLOUD_PROJECT unset ([92cfb16](https://github.com/ecomplus/application-starter/commit/92cfb166a59ef05f67a005fa6ad3b49c69fcb222))

## [1.0.0-starter.21](https://github.com/ecomplus/application-starter/compare/v1.0.0-starter.20...v1.0.0-starter.21) (2021-05-07)


### Bug Fixes

* **deps:** update @ecomplus/application-sdk to v1.14.9 ([1df5166](https://github.com/ecomplus/application-starter/commit/1df51665bf4ee0baa9edd949d5af942c5a8e26ff))
* **env:** try both GCP_PROJECT and GCLOUD_PROJECT (obsolete) ([9e53963](https://github.com/ecomplus/application-starter/commit/9e53963aa95d79b48fe63528f3f41947f619e9e9))

## [1.0.0-starter.20](https://github.com/ecomplus/application-starter/compare/v1.0.0-starter.19...v1.0.0-starter.20) (2021-04-30)

## [1.0.0-starter.19](https://github.com/ecomplus/application-starter/compare/v1.0.0-starter.18...v1.0.0-starter.19) (2021-04-05)

## [1.0.0-starter.18](https://github.com/ecomplus/application-starter/compare/v1.0.0-starter.17...v1.0.0-starter.18) (2021-04-03)


### Features

* **functions:** using node v12 engine ([96a9ed6](https://github.com/ecomplus/application-starter/commit/96a9ed612555798de9afc21ebd3895bb7fad3ab3))


### Bug Fixes

* **deps:** update all non-major dependencies ([#73](https://github.com/ecomplus/application-starter/issues/73)) ([c90e4bd](https://github.com/ecomplus/application-starter/commit/c90e4bd78172d6736c84dfa39294f411ab81fa19))
* **deps:** update all non-major dependencies ([#75](https://github.com/ecomplus/application-starter/issues/75)) ([37454b3](https://github.com/ecomplus/application-starter/commit/37454b3516e3471d8458e90f3bad09626e545794))

## [1.0.0-starter.17](https://github.com/ecomplus/application-starter/compare/v1.0.0-starter.16...v1.0.0-starter.17) (2021-02-14)


### Features

* **modules:** start examples and mocks for discounts and payment modules ([#66](https://github.com/ecomplus/application-starter/issues/66)) ([ec388a8](https://github.com/ecomplus/application-starter/commit/ec388a8cf47603fd15c448d2aae53623cd870c62))
* **update-app-data:** setup commum updateAppData method to store api lib ([888c28f](https://github.com/ecomplus/application-starter/commit/888c28fb64ccab6c2375451c12fffa5955fe277a))


### Bug Fixes

* **deps:** update all non-major dependencies ([#53](https://github.com/ecomplus/application-starter/issues/53)) ([d8b6bf3](https://github.com/ecomplus/application-starter/commit/d8b6bf31f48aa06a7352eb7bf8df52af9e8bdc3a))
* **deps:** update all non-major dependencies ([#54](https://github.com/ecomplus/application-starter/issues/54)) ([46bbafd](https://github.com/ecomplus/application-starter/commit/46bbafd363ddff88b5dc91f858ddc98cf648d232))
* **deps:** update all non-major dependencies ([#55](https://github.com/ecomplus/application-starter/issues/55)) ([470d6ed](https://github.com/ecomplus/application-starter/commit/470d6ed31ea569fa5b19c26dca29b7dcd8c659c9))
* **deps:** update all non-major dependencies ([#56](https://github.com/ecomplus/application-starter/issues/56)) ([a2382fc](https://github.com/ecomplus/application-starter/commit/a2382fc57a80eacf10aa7b1a468780aa9ca28803))
* **deps:** update all non-major dependencies ([#58](https://github.com/ecomplus/application-starter/issues/58)) ([bf4c575](https://github.com/ecomplus/application-starter/commit/bf4c575651ad99ffd6acbace95dc1f5feb419137))
* **deps:** update all non-major dependencies ([#59](https://github.com/ecomplus/application-starter/issues/59)) ([e5545d7](https://github.com/ecomplus/application-starter/commit/e5545d72ad6e2f720f2d12db6b75c7641feba7a2))
* **deps:** update all non-major dependencies ([#68](https://github.com/ecomplus/application-starter/issues/68)) ([40f8c6f](https://github.com/ecomplus/application-starter/commit/40f8c6fa598848a5a53f6b69ba3614e6734801cc))
* **deps:** update all non-major dependencies ([#69](https://github.com/ecomplus/application-starter/issues/69)) ([c01a26b](https://github.com/ecomplus/application-starter/commit/c01a26b5dd94812ca7bc6f317fdcc3074a0ce1a0))
* **deps:** update all non-major dependencies ([#70](https://github.com/ecomplus/application-starter/issues/70)) ([712fdc3](https://github.com/ecomplus/application-starter/commit/712fdc348df22de0825494f92a7696e20fefdf5d))
* **deps:** update dependency firebase-tools to ^9.2.0 ([#65](https://github.com/ecomplus/application-starter/issues/65)) ([eb84885](https://github.com/ecomplus/application-starter/commit/eb848859e7c477d52f1ad2e4b4e70589298acccc))
* **deps:** update dependency firebase-tools to v9 ([#61](https://github.com/ecomplus/application-starter/issues/61)) ([dffdf35](https://github.com/ecomplus/application-starter/commit/dffdf351a41f49b717b6316d351fe53670d5452e))

## [1.0.0-starter.16](https://github.com/ecomplus/application-starter/compare/v1.0.0-starter.15...v1.0.0-starter.16) (2020-11-05)


### Bug Fixes

* **deps:** add @google-cloud/firestore v4 as direct dep ([e79b789](https://github.com/ecomplus/application-starter/commit/e79b7899b26e900cccc06e71393838ecce3d2133))
* **deps:** update all non-major dependencies ([#38](https://github.com/ecomplus/application-starter/issues/38)) ([37a3346](https://github.com/ecomplus/application-starter/commit/37a3346de56e7c2d17ab84e732c2211d4683be6d))
* **deps:** update all non-major dependencies ([#41](https://github.com/ecomplus/application-starter/issues/41)) ([77b78ef](https://github.com/ecomplus/application-starter/commit/77b78efbc64bfa32719bcd79ba4ed8da2dc57582))
* **deps:** update all non-major dependencies ([#48](https://github.com/ecomplus/application-starter/issues/48)) ([c0042d8](https://github.com/ecomplus/application-starter/commit/c0042d85f06315ffac6157f485a25fe1e0a13a01))
* **deps:** update all non-major dependencies ([#49](https://github.com/ecomplus/application-starter/issues/49)) ([dc4d847](https://github.com/ecomplus/application-starter/commit/dc4d8477f05d3d4d9b83da21d42c5e394e931c82))
* **deps:** update dependency firebase-admin to ^9.2.0 ([#47](https://github.com/ecomplus/application-starter/issues/47)) ([156714a](https://github.com/ecomplus/application-starter/commit/156714a9f3c0e71f28466efdb850874eaec283b6))
* **refresh-tokens:** add scheduled cloud function to run update ([d338924](https://github.com/ecomplus/application-starter/commit/d33892474a8c0c07bab14791cf9c4417baca00d1))

## [1.0.0-starter.15](https://github.com/ecomplus/application-starter/compare/v1.0.0-starter.14...v1.0.0-starter.15) (2020-07-26)


### Bug Fixes

* **deps:** bump @ecomplus/application-sdk@firestore ([fe4fe46](https://github.com/ecomplus/application-starter/commit/fe4fe46c2c4e1dfd21790f8c03a84245cb8fc8f3))
* **deps:** update all non-major dependencies ([#36](https://github.com/ecomplus/application-starter/issues/36)) ([b14f2e9](https://github.com/ecomplus/application-starter/commit/b14f2e9cb56d5b18500b678b074dbdbe099b041a))
* **deps:** update dependency firebase-admin to v9 ([#37](https://github.com/ecomplus/application-starter/issues/37)) ([204df95](https://github.com/ecomplus/application-starter/commit/204df95c37d24c455951081f9186178222097778))

## [1.0.0-starter.14](https://github.com/ecomplus/application-starter/compare/v1.0.0-starter.13...v1.0.0-starter.14) (2020-06-30)


### Bug Fixes

* **auth-callback:** check `row.setted_up` in place of 'settep_up' ([e2a73ca](https://github.com/ecomplus/application-starter/commit/e2a73ca029868d9c899d4a1c0d982f1c1ed5829f))
* **deps:** update all non-major dependencies ([#31](https://github.com/ecomplus/application-starter/issues/31)) ([702bee9](https://github.com/ecomplus/application-starter/commit/702bee9a31370579dd7718b5722180e5bb8996e8))
* **deps:** update dependency firebase-functions to ^3.7.0 ([#30](https://github.com/ecomplus/application-starter/issues/30)) ([0f459a3](https://github.com/ecomplus/application-starter/commit/0f459a3ab9fe21f8dc9e9bdfce33c0b6d43e3622))
* **deps:** update dependency firebase-tools to ^8.4.2 ([#29](https://github.com/ecomplus/application-starter/issues/29)) ([cf7e61e](https://github.com/ecomplus/application-starter/commit/cf7e61ef50aa976f33725d855ba19d06a7522fd4))
* **pkg:** update deps, start using node 10 ([172ed7f](https://github.com/ecomplus/application-starter/commit/172ed7f223cd23b9874c5d6209928b7d620b0cf6))

## [1.0.0-starter.13](https://github.com/ecomplus/application-starter/compare/v1.0.0-starter.12...v1.0.0-starter.13) (2020-06-03)


### Bug Fixes

* **deps:** update @ecomplus/application-sdk to v1.13.0 ([b424410](https://github.com/ecomplus/application-starter/commit/b42441089e7020774c9586ed176e691ef4c755be))
* **refresh-tokens:** force appSdk update tokens task ([139a350](https://github.com/ecomplus/application-starter/commit/139a350c230fa36c37ab83e2debfe979d831cb08))

## [1.0.0-starter.12](https://github.com/ecomplus/application-starter/compare/v1.0.0-starter.11...v1.0.0-starter.12) (2020-05-29)


### Bug Fixes

* **deps:** replace @ecomplus/application-sdk to firestore version ([3d2ee85](https://github.com/ecomplus/application-starter/commit/3d2ee85feb2edab77950e5c266514152fbc9674d))
* **deps:** update all non-major dependencies ([#21](https://github.com/ecomplus/application-starter/issues/21)) ([7a370da](https://github.com/ecomplus/application-starter/commit/7a370da11dfd098c0a90da05d39fc62f9264fd63))
* **deps:** update all non-major dependencies ([#26](https://github.com/ecomplus/application-starter/issues/26)) ([e37e0e8](https://github.com/ecomplus/application-starter/commit/e37e0e8151768d79e81f4184ab937ddf9d775a4f))
* **deps:** update dependency uglify-js to ^3.9.2 ([#20](https://github.com/ecomplus/application-starter/issues/20)) ([adccf0a](https://github.com/ecomplus/application-starter/commit/adccf0a2fed37f2ccce57ded20d25af85407ac8a))

## [1.0.0-starter.11](https://github.com/ecomplus/application-starter/compare/v1.0.0-starter.10...v1.0.0-starter.11) (2020-04-27)


### Bug Fixes

* **deps:** update @ecomplus/application-sdk to v1.11.13 ([70584c2](https://github.com/ecomplus/application-starter/commit/70584c245e97a1b539a3df3f74109f20d9a1fa3c))
* **setup:** ensure enable token updates by default ([67aea0e](https://github.com/ecomplus/application-starter/commit/67aea0eb363be3cc535a0f0f4d1b5b682958f243))

## [1.0.0-starter.10](https://github.com/ecomplus/application-starter/compare/v1.0.0-starter.9...v1.0.0-starter.10) (2020-04-27)


### Bug Fixes

* **deps:** update @ecomplus/application-sdk to v1.11.11 ([b8217d0](https://github.com/ecomplus/application-starter/commit/b8217d03fe92b5c233615a0b6b4c01d7bad676c2))
* **deps:** update all non-major dependencies ([#19](https://github.com/ecomplus/application-starter/issues/19)) ([a99797a](https://github.com/ecomplus/application-starter/commit/a99797a129d6e2383ef5ef69c06afacd13cccfb0))
* **setup:** do not disable updates on refresh-tokens route ([b983a45](https://github.com/ecomplus/application-starter/commit/b983a45ada5575ee6435f7b3016ef35c28355762))

## [1.0.0-starter.9](https://github.com/ecomplus/application-starter/compare/v1.0.0-starter.8...v1.0.0-starter.9) (2020-04-21)


### Bug Fixes

* **deps:** update @ecomplus/application-sdk to v1.11.10 ([8da579c](https://github.com/ecomplus/application-starter/commit/8da579c19c6530e8cc9fd338a07aece1fccc64ff))

## [1.0.0-starter.8](https://github.com/ecomplus/application-starter/compare/v1.0.0-starter.7...v1.0.0-starter.8) (2020-04-18)


### Bug Fixes

* **deps:** update all non-major dependencies ([#17](https://github.com/ecomplus/application-starter/issues/17)) ([785064e](https://github.com/ecomplus/application-starter/commit/785064ef5bf06db7c084f9b17b37a6077645735b))

## [1.0.0-starter.7](https://github.com/ecomplus/application-starter/compare/v1.0.0-starter.6...v1.0.0-starter.7) (2020-04-07)

## [1.0.0-starter.6](https://github.com/ecomplus/application-starter/compare/v1.0.0-starter.5...v1.0.0-starter.6) (2020-04-06)


### Bug Fixes

* **deps:** update all non-major dependencies ([#10](https://github.com/ecomplus/application-starter/issues/10)) ([b3c65e5](https://github.com/ecomplus/application-starter/commit/b3c65e5c7eb89a4825eb47c852ce65293d172314))
* **deps:** update all non-major dependencies ([#13](https://github.com/ecomplus/application-starter/issues/13)) ([33ff19b](https://github.com/ecomplus/application-starter/commit/33ff19bbdad1f34b6d1c255089dc0a0e4092b955))
* **deps:** update all non-major dependencies ([#8](https://github.com/ecomplus/application-starter/issues/8)) ([feba5b9](https://github.com/ecomplus/application-starter/commit/feba5b9cdc54e8304beff2b12658a6343ef37569))
* **deps:** update dependency firebase-functions to ^3.6.0 ([#15](https://github.com/ecomplus/application-starter/issues/15)) ([5f7f0a2](https://github.com/ecomplus/application-starter/commit/5f7f0a2bf5c744000996e2a0b78690b363462ee7))
* **deps:** update dependency firebase-tools to ^7.16.1 ([#14](https://github.com/ecomplus/application-starter/issues/14)) ([b8e4798](https://github.com/ecomplus/application-starter/commit/b8e479851bd02bf5929a7df8a71a761f1c1c1654))
* **deps:** update dependency firebase-tools to v8 ([#16](https://github.com/ecomplus/application-starter/issues/16)) ([b72560e](https://github.com/ecomplus/application-starter/commit/b72560e4fc86496499d553e47094ace25436272b))
* **ecom-modules:** fix parsing mod names to filenames and vice versa ([99c185a](https://github.com/ecomplus/application-starter/commit/99c185afebeae77deb61537ed9de1c77132c16ce))

## [1.0.0-starter.5](https://github.com/ecomplus/application-starter/compare/v1.0.0-starter.4...v1.0.0-starter.5) (2020-03-05)


### Features

* **market-publication:** handle full featured app publication to Market ([28379dc](https://github.com/ecomplus/application-starter/commit/28379dc3c4784e757c8f25e5d737f6143682b0db))
* **static:** handle static with server app files from public folder ([827d000](https://github.com/ecomplus/application-starter/commit/827d00079b0dc169b2eef31b8e0ac73c596307a8))

## [1.0.0-starter.4](https://github.com/ecomplus/application-starter/compare/v1.0.0-starter.3...v1.0.0-starter.4) (2020-02-21)


### Features

* **calculate-shipping:** basic setup for calculate shipping module ([db77595](https://github.com/ecomplus/application-starter/commit/db7759514bb25d151dd4508fb96b84c52b3e94ba))


### Bug Fixes

* **home:** fix replace accets regex exps to generate slug from title ([198cc0b](https://github.com/ecomplus/application-starter/commit/198cc0b911d4874d96f3cd5254d30cab5fe89765))
* **home:** gen slug from pkg name or app title if not set or default ([25c20bf](https://github.com/ecomplus/application-starter/commit/25c20bfade65a86e4f4b1026ef59a5694a022a74))

## [1.0.0-starter.3](https://github.com/ecomplus/application-starter/compare/v1.0.0-starter.2...v1.0.0-starter.3) (2020-02-21)

## [1.0.0-starter.2](https://github.com/ecomplus/application-starter/compare/v1.0.0-starter.1...v1.0.0-starter.2) (2020-02-21)


### Bug Fixes

* **config:** stop reading app from functions config ([7b9aab7](https://github.com/ecomplus/application-starter/commit/7b9aab727fefe8a5b84695e90a0d68e02b8c3f62))

## [1.0.0-starter.1](https://github.com/ecomplus/application-starter/compare/v1.0.0-starter.0...v1.0.0-starter.1) (2020-02-20)


### Features

* **get-auth:** endpoint to return auth id and token for external usage ([40a8ae2](https://github.com/ecomplus/application-starter/commit/40a8ae2e895d6e32c7032ca500040ec82c80dc5d))
* **server:** also supporting passing Store Id from query ([111f3a7](https://github.com/ecomplus/application-starter/commit/111f3a716fbfd2e155e3fb24242bddcae7cb065c))


### Bug Fixes

* **server:** remove 'routes' path when setting filename for routes ([119524c](https://github.com/ecomplus/application-starter/commit/119524c523a11364ed912769637a6f8e479af5f1))

## [1.0.0-starter.0](https://github.com/ecomplus/application-starter/compare/v0.1.1...v1.0.0-starter.0) (2020-02-18)


### Features

* **router:** recursive read routes dir to auto setup server routes ([ff2b456](https://github.com/ecomplus/application-starter/commit/ff2b45604723a8146c9481ea36a9400da5ccc2bc))


### Bug Fixes

* **home:** fix semver on for app.version (remove version tag if any) ([ad36461](https://github.com/ecomplus/application-starter/commit/ad364614a7f5599850ad39e00a94d310742e8f80))
* **middlewares:** update route files exports (named exports by methods) ([6a22e67](https://github.com/ecomplus/application-starter/commit/6a22e67135bc6110e6da6b4ab25f67ad8d77f597))

### [0.1.1](https://github.com/ecomplus/application-starter/compare/v0.1.0...v0.1.1) (2020-02-18)


### Features

* **env:** get 'pkg' from functions config ([bf45ec3](https://github.com/ecomplus/application-starter/commit/bf45ec33a2147d5be91fdc4955bd6cfa1b0867e2))
* **home:** set version and slug from root package, fix with uris ([d4b61fa](https://github.com/ecomplus/application-starter/commit/d4b61fab427aefdb2ac485d90eb1abe15d6aafc6))


### Bug Fixes

* **env:** firebase doesnt uppercase config ([502185e](https://github.com/ecomplus/application-starter/commit/502185ed30f346d8db77b849d6ba0eb48cb777cb))
* **require:** update @ecomplus/application-sdk dependency name ([d4174ac](https://github.com/ecomplus/application-starter/commit/d4174ac5425b85590db0e92d4b1d69a8567a6c55))

## [0.1.0](https://github.com/ecomplus/application-starter/compare/v0.0.4...v0.1.0) (2020-02-17)

### [0.0.4](https://github.com/ecomclub/firebase-app-boilerplate/compare/v0.0.3...v0.0.4) (2020-02-16)


### Bug Fixes

* **server:** update routes names (refresh-tokens) ([79a2910](https://github.com/ecomclub/firebase-app-boilerplate/commit/79a2910817cf4193b40e02b2b1e6b920e7fefb2d))

### [0.0.3](https://github.com/ecomclub/express-app-boilerplate/compare/v0.0.2...v0.0.3) (2020-02-15)


### Features

* **server:** start reading env options, handle operator token ([ce107b7](https://github.com/ecomclub/express-app-boilerplate/commit/ce107b74cde375e875a85cc3ba0cc6a73740785d))
* **update-tokens:** adding route to start update tokens service (no content) ([20c62ec](https://github.com/ecomclub/express-app-boilerplate/commit/20c62ec6800fc326b89e8cf54b2916f56e5910e4))


### Bug Fixes

* **auth-callback:** fix handling docRef (desn't need to get by id again) ([629ca5a](https://github.com/ecomclub/express-app-boilerplate/commit/629ca5ab9849e3822cc190f423da5bf2e0c4daab))
* **auth-callback:** save procedures if not new, check and set 'settep_up' ([#3](https://github.com/ecomclub/express-app-boilerplate/issues/3)) ([4a01f86](https://github.com/ecomclub/express-app-boilerplate/commit/4a01f86c37e09cd7c0363f6fbc80de6eeef3ba20))
* **ECOM_AUTH_UPDATE_INTERVAL:** disable set interval (no daemons on cloud functions) ([2aa2442](https://github.com/ecomclub/express-app-boilerplate/commit/2aa2442061f0308be9eb9430552fa04ad148788c))
* **env:** fixed to get appInfor variable ([e9b1a3c](https://github.com/ecomclub/express-app-boilerplate/commit/e9b1a3ce0d17ee74a5eada70589340fd5a70e786))
* **env:** fixed to get appInfor variable ([22687e2](https://github.com/ecomclub/express-app-boilerplate/commit/22687e25f611d49f8c01494af114e0289cec251e))
* **middleware:** check standard http headers for client ip ([5045113](https://github.com/ecomclub/express-app-boilerplate/commit/504511329afe9277d540f0f542a316d04634ce9e))

### 0.0.2 (2020-02-11)


### Bug Fixes

* **lib:** remove unecessary/incorrect requires with new deps ([69f2b77](https://github.com/ecomclub/express-app-boilerplate/commit/69f2b77))
* **routes:** fix handling appSdk (param) ([0cf2dde](https://github.com/ecomclub/express-app-boilerplate/commit/0cf2dde))
* **setup:** added initializeApp() to firebase admin ([e941e59](https://github.com/ecomclub/express-app-boilerplate/commit/e941e59))
* **setup:** manually setup ecomplus-app-sdk with firestore ([64e49f8](https://github.com/ecomclub/express-app-boilerplate/commit/64e49f8))
* **setup:** manually setup ecomplus-app-sdk with firestore ([c718bd0](https://github.com/ecomclub/express-app-boilerplate/commit/c718bd0))
* **setup:** manually setup ecomplus-app-sdk with firestore ([33909bf](https://github.com/ecomclub/express-app-boilerplate/commit/33909bf)), closes [/github.com/ecomclub/ecomplus-app-sdk/blob/master/main.js#L45](https://github.com/ecomclub//github.com/ecomclub/ecomplus-app-sdk/blob/master/main.js/issues/L45)
* **startup:** setup routes after appSdk ready, add home route ([d182555](https://github.com/ecomclub/express-app-boilerplate/commit/d182555))


### Features

* **firestore-app-boilerplate:** Initial commit ([c9963f0](https://github.com/ecomclub/express-app-boilerplate/commit/c9963f0))
* **firestore-app-boilerplate:** Initial commit ([be493ea](https://github.com/ecomclub/express-app-boilerplate/commit/be493ea))
* **firestore-support:** minor changes ([3718cba](https://github.com/ecomclub/express-app-boilerplate/commit/3718cba))
* **firestore-support:** refactoring to  use saveProcedures function ([62971ef](https://github.com/ecomclub/express-app-boilerplate/commit/62971ef))
* **firestore-support:** removed sqlite error clausule ([2d47996](https://github.com/ecomclub/express-app-boilerplate/commit/2d47996))
* **routes:** add home route (app json) ([42a3f2b](https://github.com/ecomclub/express-app-boilerplate/commit/42a3f2b))

# [LEGACY] Express App Boilerplate

### [0.1.1](https://github.com/ecomclub/express-app-boilerplate/compare/v0.1.0...v0.1.1) (2019-07-31)


### Bug Fixes

* **procedures:** fix checking for procedures array to run configureSetup ([1371cdc](https://github.com/ecomclub/express-app-boilerplate/commit/1371cdc))

## [0.1.0](https://github.com/ecomclub/express-app-boilerplate/compare/v0.0.2...v0.1.0) (2019-07-31)

### 0.0.2 (2019-07-31)


### Bug Fixes

* chain promise catch on lib getConfig ([281abf9](https://github.com/ecomclub/express-app-boilerplate/commit/281abf9))
* fix mergin hidden data to config ([8b64d58](https://github.com/ecomclub/express-app-boilerplate/commit/8b64d58))
* fix path to require 'get-config' from lib ([11425b0](https://github.com/ecomclub/express-app-boilerplate/commit/11425b0))
* get storeId from header and set on req object ([a3bebaa](https://github.com/ecomclub/express-app-boilerplate/commit/a3bebaa))
* handle error on get config instead of directly debug ([f182589](https://github.com/ecomclub/express-app-boilerplate/commit/f182589))
* routes common fixes ([2758a57](https://github.com/ecomclub/express-app-boilerplate/commit/2758a57))
* using req.url (from http module) instead of req.baseUrl ([d9057ca](https://github.com/ecomclub/express-app-boilerplate/commit/d9057ca))


### Features

* authentication callback ([8f18892](https://github.com/ecomclub/express-app-boilerplate/commit/8f18892))
* conventional store api error handling ([bcde87e](https://github.com/ecomclub/express-app-boilerplate/commit/bcde87e))
* function to get app config from data and hidden data ([ba470f5](https://github.com/ecomclub/express-app-boilerplate/commit/ba470f5))
* getting store id from web.js ([72f18c6](https://github.com/ecomclub/express-app-boilerplate/commit/72f18c6))
* handling E-Com Plus webhooks ([63ba19f](https://github.com/ecomclub/express-app-boilerplate/commit/63ba19f))
* main js file including bin web and local ([6b8a71a](https://github.com/ecomclub/express-app-boilerplate/commit/6b8a71a))
* pre-validate body for ecom modules endpoints ([f06bdb0](https://github.com/ecomclub/express-app-boilerplate/commit/f06bdb0))
* setup app package dependencies and main.js ([b2826ed](https://github.com/ecomclub/express-app-boilerplate/commit/b2826ed))
* setup base app.json ([015599a](https://github.com/ecomclub/express-app-boilerplate/commit/015599a))
* setup daemon processes, configure store setup ([db3ca8c](https://github.com/ecomclub/express-app-boilerplate/commit/db3ca8c))
* setup procedures object ([c5e8627](https://github.com/ecomclub/express-app-boilerplate/commit/c5e8627))
* setup web app with express ([d128430](https://github.com/ecomclub/express-app-boilerplate/commit/d128430))
