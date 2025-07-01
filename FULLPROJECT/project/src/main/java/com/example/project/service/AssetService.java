package com.example.project.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

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
}
