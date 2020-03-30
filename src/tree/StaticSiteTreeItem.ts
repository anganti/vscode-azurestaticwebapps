/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { AzureParentTreeItem, AzureTreeItem, DialogResponses, TreeItemIconPath } from "vscode-azureextensionui";
import { ext } from "../extensionVariables";
import { localize } from "../utils/localize";
import { requestUtils } from "../utils/requestUtils";
import { treeUtils } from "../utils/treeUtils";

export type StaticSite = {
    id: string;
    location: string;
    name: string;
    properties: {
        defaultHostname: string;
        repositoryUrl: string;
        branch: string;
        customDomains: string[];
    };
    sku: {
        name: string;
        tier: string;
    };
    // tslint:disable-next-line:no-reserved-keywords
    type: string;
};

export class StaticSiteTreeItem extends AzureTreeItem {
    public static contextValue: string = 'azureStaticSite';
    public readonly contextValue: string = StaticSiteTreeItem.contextValue;
    public readonly data: StaticSite;

    constructor(parent: AzureParentTreeItem, ss: StaticSite) {
        super(parent);
        this.data = ss;
    }

    public get name(): string {
        return this.data.name;
    }

    public get id(): string {
        return this.data.id;
    }

    public get label(): string {
        return this.data.name;
    }

    public get description(): string | undefined {
        return this.data.properties.defaultHostname;
    }

    public get iconPath(): TreeItemIconPath {
        return treeUtils.getIconPath('resourceGroup');
    }

    public async deleteTreeItemImpl(): Promise<void> {
        const confirmMessage: string = localize('deleteConfirmation', 'Are you sure you want to delete "{0}"?', this.name);
        await ext.ui.showWarningMessage(confirmMessage, { modal: true }, DialogResponses.deleteResponse, DialogResponses.cancel);

        const requestOptions: requestUtils.Request = await requestUtils.getDefaultAzureRequest(`${this.id}?api-version=2019-12-01-preview`, this.root, 'DELETE');

        const deleting: string = localize('Deleting', 'Deleting "{0}"...', this.name);
        const deleteSucceeded: string = localize('DeleteSucceeded', 'Successfully deleted "{0}".', this.name);
        await vscode.window.withProgress({ location: vscode.ProgressLocation.Notification, title: deleting }, async (): Promise<void> => {
            ext.outputChannel.appendLog(deleting);
            await requestUtils.sendRequest(requestOptions);
            vscode.window.showInformationMessage(deleteSucceeded);
            ext.outputChannel.appendLog(deleteSucceeded);
        });
    }
}