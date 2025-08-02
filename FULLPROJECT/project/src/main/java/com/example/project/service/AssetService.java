package com.example.project.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.project.dto.AssetDataDTO;
import com.example.project.model.AssetData;
import com.example.project.repository.AssetDataRepository;

@Service
public class AssetService {

	@Autowired
    private  AssetDataRepository repository;

    public void save(MultipartFile file) {
        try {
            List<AssetData> dataList = ExcelHelper.excelToAssetData(file.getInputStream());
            repository.saveAll(dataList);
        } catch (Exception e) {
            throw new RuntimeException("Failed to save Excel data: " + e.getMessage());
        }
    }

	public List<AssetData> getAssets() {
		List<AssetData> assets = new ArrayList<>();
		List<AssetData>	assetlist = repository.findAll();
		assets.addAll(assetlist);
		return assets;
		
	}

	public void AddAsset(AssetDataDTO data) {
		try {
			AssetData asset = new AssetData();
			asset.setVcType(data.getVcType());
			asset.setVcSerialNo(data.getVcSerialNo());
			asset.setUoc(data.getUoc());
			asset.setOutletName(data.getOutletName());
			asset.setAddress(data.getAddress());
			asset.setState(data.getState());
			asset.setPostalCode(data.getPostalCode());
			asset.setContactPerson(data.getContactPerson());
			asset.setMobileNumber(data.getMobileNumber());
			asset.setStatus(data.getSts());

			repository.save(asset);
		} catch (Exception e) {
			throw new RuntimeException("Failed to add asset: " + e.getMessage());
		}
		
	}

	public void deleteAsset(String mobno) {
	
			Optional<AssetData> asset = repository.findByMobileNumber(mobno);
			System.out.println("Asset with mobile number: " + mobno + " found: " + asset.isPresent());
			if (asset.isPresent()) {
				try {
					repository.delete(asset.get());
					
				} catch (Exception e) {
					throw new RuntimeException("Failed to delete asset: " + e.getMessage());
				}
			} else {
				throw new RuntimeException("Asset not found with mobile number: " + mobno);
			}
		}

	public void updateAsset(String mobileNumber, AssetDataDTO data) {
		Optional<AssetData> asset = repository.findByMobileNumber(mobileNumber);
		System.out.println("Asset with mobile number: " + mobileNumber + " found: " + asset.isPresent());
		if (asset.isPresent()) {
			try {
				AssetData existingAsset = asset.get();
				existingAsset.setVcType(data.getVcType());
				existingAsset.setVcSerialNo(data.getVcSerialNo());
				existingAsset.setUoc(data.getUoc());
				existingAsset.setOutletName(data.getOutletName());
				existingAsset.setAddress(data.getAddress());
				existingAsset.setState(data.getState());
				existingAsset.setPostalCode(data.getPostalCode());
				existingAsset.setContactPerson(data.getContactPerson());
				existingAsset.setMobileNumber(data.getMobileNumber());
				existingAsset.setStatus(data.getSts());

				repository.save(existingAsset);
			} catch (Exception e) {
				throw new RuntimeException("Failed to update asset: " + e.getMessage());
			}
		} else {
			throw new RuntimeException("Asset not found with mobile number: " + mobileNumber);
		}
	}	
}

