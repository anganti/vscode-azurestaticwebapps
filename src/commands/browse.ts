/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IActionContext } from 'vscode-azureextensionui';
import { ext } from '../extensionVariables';
import { StaticSiteTreeItem } from "../tree/StaticSiteTreeItem";

export async function browse(context: IActionContext, node?: StaticSiteTreeItem): Promise<void> {
    if (!node) {
        node = await ext.tree.showTreeItemPicker<StaticSiteTreeItem>(StaticSiteTreeItem.contextValue, context);
    }

    await node.browse();
}
