import {
    Plugin,
    showMessage,
    confirm,
    Dialog,
    Menu,
    openTab,
    adaptHotkey,
    getFrontend,
    getBackend,
    IModel,
    Protyle,
    openWindow,
    IOperation,
    Constants
} from "siyuan";
import "@/index.scss";



import { SettingUtils } from "./libs/setting-utils";

const STORAGE_NAME = "menu-config";

export default class PluginSample extends Plugin {

    private settingUtils: SettingUtils;

    async onload() {
        this.data[STORAGE_NAME] = { readonlyText: "Readonly" };

        this.settingUtils = new SettingUtils(this, STORAGE_NAME);

        this.settingUtils.load();

        this.settingUtils.addItem({
            key: "mainSwitch",
            value: false,
            type: "checkbox",
            title: this.i18n.mainSwitch,
            description: "",
        });

        this.settingUtils.addItem({
            key: "monitorVisibility",
            value: true,
            type: "checkbox",
            title: this.i18n.monitorVisibility,
            description: "",
        });

        this.settingUtils.addItem({
            key: "monitorMouse",
            value: true,
            type: "checkbox",
            title: this.i18n.monitorMouse,
            description: "",
        });

        this.settingUtils.addItem({
            key: "Slider",
            value: 50,
            type: "slider",
            title: this.i18n.timeout,
            description: this.i18n.timeUnit,
            slider: {
                min: 0.5,
                max: 120,
                step: 0.5,
            }
        });
    }


    onLayoutReady() {

        this.loadData(STORAGE_NAME);
        this.settingUtils.load();

        let timer;

        document.addEventListener("visibilitychange", () => {
            if (document.hidden) {
                timer = setTimeout(() => {
                    if (this.settingUtils.get("mainSwitch") && this.settingUtils.get("monitorVisibility")) {
                        this.lockSiyuan();
                    }


                }, this.settingUtils.get("Slider") * 1000); // 1分钟 = 60秒 * 1000毫秒
            } else {
                clearTimeout(timer);
            }
        });

        document.addEventListener("mouseout", () => {
            timer = setTimeout(() => {

                if (this.settingUtils.get("mainSwitch") && this.settingUtils.get("monitorMouse")) {
                    this.lockSiyuan();
                }

            }, this.settingUtils.get("Slider") * 1000);
        });

        document.addEventListener("mouseover", () => {
            clearTimeout(timer);
        });


    }


    async lockSiyuan() {
        var mainMenuButton = document.getElementById("barWorkspace");
        var buttonElements = document.querySelectorAll('.b3-menu__item');


        //click main menu icon
        if (mainMenuButton) {
            mainMenuButton.click();
            await this.sleep(1000);
        } else {
            console.log("未找到按钮元素");
            return;
        }


        //click
        var targetButton;
        buttonElements.forEach(function (button) {
            var labelElement = button.querySelector('.b3-menu__label');
            if (labelElement && labelElement.textContent.trim() === '锁屏') {
                targetButton = button;
            }
        });


        if (targetButton) {
            targetButton.click();
        } else {
            console.error('找不到包含 "锁屏" 文本的按钮');
        }
    }

    // 辅助函数，用于等待指定的毫秒数
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }



    async onunload() {
        await this.settingUtils.save();
        showMessage("Goodbye SiYuan Plugin");
    }












}
